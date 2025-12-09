// apps/web/src/services/api/journalApi.ts
import axios from 'axios';
import { authUtils } from '@/utils/authUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authUtils.getToken();
    
    if (token) {
      if (authUtils.isTokenExpired(token)) {
        console.warn('Token is expired, redirecting to login...');
        authUtils.logout();
        authUtils.redirectToLogin();
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth');
    
    if (error.response?.status === 401 && !isAuthPage && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.error('Authentication error (401):', {
        url: originalRequest.url,
        message: error.response?.data?.message || 'Unauthorized'
      });
      
      authUtils.logout();
      authUtils.redirectToLogin();
    }
    
    return Promise.reject(error);
  }
);

export interface CreateJournalEntryPayload {
  title?: string;
  content: string;
  moodBefore?: number;
  moodAfter?: number;
  tags?: string[];
  isPrivate?: boolean;
}

export interface JournalEntryResponse {
  id: string;
  userId: string;
  title?: string;
  content: string;
  moodBefore?: number;
  moodAfter?: number;
  tags: string[];
  isPrivate: boolean;
  aiAnalysis?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntriesListResponse {
  data: JournalEntryResponse[];
  total: number;
  page: number;
  limit: number;
}

interface BackendWrappedResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface BackendListResponse {
  success: true;
  data: JournalEntryResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface JournalStatistics {
  totalEntries: number;
  entriesThisMonth: number;
  averageMoodBefore: number;
  averageMoodAfter: number;
  moodImprovement: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  longestStreak: number;
  currentStreak: number;
}

interface BackendStatisticsResponse {
  success: true;
  data: JournalStatistics;
}

export const journalApi = {
  // Create new journal entry
  createJournalEntry: async (
    payload: CreateJournalEntryPayload
  ): Promise<JournalEntryResponse> => {
    const response = await apiClient.post<BackendWrappedResponse<JournalEntryResponse>>(
      '/journal-entries',
      payload
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return response.data as unknown as JournalEntryResponse;
  },

  // Get all journal entries with pagination and filters
  getJournalEntries: async (params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
  }): Promise<JournalEntriesListResponse> => {
    const response = await apiClient.get<BackendListResponse>(
      '/journal-entries',
      { params }
    );
    
    if (response.data.success) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    }
    
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };
  },

  // Get recent journal entries
  getRecentEntries: async (days: number = 7): Promise<JournalEntryResponse[]> => {
    try {
      const response = await apiClient.get<BackendListResponse>(
        '/journal-entries/recent',
        { params: { days } }
      );
      
      console.log('📖 Raw API Response:', response.data);
      
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log('✅ Found', response.data.data.length, 'journal entries');
          return response.data.data;
        }
      }
      
      if (Array.isArray(response.data)) {
        console.log('✅ Direct array response:', response.data.length, 'entries');
        return response.data;
      }
      
      console.warn('⚠️ Unexpected response format:', response.data);
      return [];
    } catch (error) {
      console.error('❌ Error fetching recent entries:', error);
      throw error;
    }
  },

  // Get journal statistics
  getStatistics: async (days: number = 30): Promise<JournalStatistics> => {
    try {
      const response = await apiClient.get<BackendStatisticsResponse>(
        '/journal-entries/statistics',
        { params: { days } }
      );
      
      console.log('📊 Raw Statistics Response:', response.data);
      
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        if (response.data.success && response.data.data) {
          console.log('✅ Statistics loaded:', response.data.data);
          return response.data.data;
        }
      }
      
      if (response.data && 'totalEntries' in response.data) {
        console.log('✅ Direct stats response');
        return response.data as unknown as JournalStatistics;
      }
      
      console.warn('⚠️ Unexpected statistics format, returning defaults');
      return {
        totalEntries: 0,
        entriesThisMonth: 0,
        averageMoodBefore: 0,
        averageMoodAfter: 0,
        moodImprovement: 0,
        mostUsedTags: [],
        longestStreak: 0,
        currentStreak: 0,
      };
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  },

  // Get single journal entry
  getJournalEntry: async (id: string): Promise<JournalEntryResponse> => {
    const response = await apiClient.get<BackendWrappedResponse<JournalEntryResponse>>(
      `/journal-entries/${id}`
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return response.data as unknown as JournalEntryResponse;
  },

  // Update journal entry
  updateJournalEntry: async (
    id: string,
    payload: Partial<CreateJournalEntryPayload>
  ): Promise<JournalEntryResponse> => {
    const response = await apiClient.patch<BackendWrappedResponse<JournalEntryResponse>>(
      `/journal-entries/${id}`,
      payload
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return response.data as unknown as JournalEntryResponse;
  },

  // Delete journal entry
  deleteJournalEntry: async (id: string): Promise<void> => {
    await apiClient.delete(`/journal-entries/${id}`);
  },
};

export default journalApi;