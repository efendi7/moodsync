// apps/web/src/services/api/moodApi.ts
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
      // Check if token is expired
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
    
    // Jangan redirect jika sedang di halaman auth
    const isAuthPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth');
    
    if (error.response?.status === 401 && !isAuthPage && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.error('Authentication error (401):', {
        url: originalRequest.url,
        message: error.response?.data?.message || 'Unauthorized'
      });
      
      // Logout dan redirect
      authUtils.logout();
      authUtils.redirectToLogin();
    }
    
    return Promise.reject(error);
  }
);

export interface CreateMoodEntryPayload {
  mood: string;
  intensity: number;
  energy?: number;
  stress?: number;
  anxiety?: number;
  happiness?: number;
  emotions?: string[];
  note?: string;
  tags?: string[];
  location?: string;
  weatherCondition?: string;
  recordedAt?: string;
}

export interface MoodEntryResponse {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  emotions: string[];
  note?: string;
  tags: string[];
  energy: number;
  stress: number;
  anxiety: number;
  happiness: number;
  location?: string;
  weatherCondition?: string;
  recordedAt: Date;
  createdAt: Date;
}

export interface MoodEntriesListResponse {
  data: MoodEntryResponse[];
  total: number;
  page: number;
  limit: number;
}

// ✅ Backend wrapped response types
interface BackendWrappedResponse<T> {
  success: true;
  data: T;
}

interface BackendListResponse {
  success: true;
  data: MoodEntryResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

interface BackendStatisticsResponse {
  success: true;
  data: {
    totalEntries: number;
    averageMood: number;
    averageEnergy: number;
    averageStress: number;
    averageAnxiety: number;
    averageHappiness: number;
    mostCommonTags: Array<{ tag: string; count: number }>;
  };
}

export interface MoodStatistics {
  totalEntries: number;
  averageMood: number;
  averageEnergy: number;
  averageStress: number;
  averageAnxiety: number;
  averageHappiness: number;
  mostCommonTags: Array<{ tag: string; count: number }>;
}

export const moodApi = {
  // Create new mood entry
  createMoodEntry: async (
    payload: CreateMoodEntryPayload
  ): Promise<MoodEntryResponse> => {
    const response = await apiClient.post<MoodEntryResponse>(
      '/mood-entries',
      payload
    );
    return response.data;
  },

  // Get all mood entries with pagination and filters
  getMoodEntries: async (params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<MoodEntriesListResponse> => {
    const response = await apiClient.get<BackendListResponse>(
      '/mood-entries',
      { params }
    );
    
    // ✅ Unwrap backend response
    if (response.data.success) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    }
    
    // Fallback
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };
  },

  // Get recent mood entries
  getRecentEntries: async (days: number = 7): Promise<MoodEntryResponse[]> => {
    try {
      const response = await apiClient.get<BackendListResponse>(
        '/mood-entries/recent',
        { params: { days } }
      );
      
      console.log('📊 Raw API Response:', response.data);
      
      // ✅ Handle wrapped response { success: true, data: [...] }
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log('✅ Found', response.data.data.length, 'entries');
          return response.data.data;
        }
      }
      
      // ✅ Handle direct array response (backward compatibility)
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

  // Get mood statistics
  getStatistics: async (days: number = 30): Promise<MoodStatistics> => {
    try {
      const response = await apiClient.get<BackendStatisticsResponse>(
        '/mood-entries/statistics',
        { params: { days } }
      );
      
      console.log('📈 Raw Statistics Response:', response.data);
      
      // ✅ Handle wrapped response { success: true, data: {...} }
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        if (response.data.success && response.data.data) {
          console.log('✅ Statistics loaded:', response.data.data);
          return response.data.data;
        }
      }
      
      // ✅ Handle direct stats response (backward compatibility)
      if (response.data && 'totalEntries' in response.data) {
        console.log('✅ Direct stats response');
        return response.data as unknown as MoodStatistics;
      }
      
      console.warn('⚠️ Unexpected statistics format, returning defaults');
      return {
        totalEntries: 0,
        averageMood: 0,
        averageEnergy: 0,
        averageStress: 0,
        averageAnxiety: 0,
        averageHappiness: 0,
        mostCommonTags: [],
      };
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  },

  // Get single mood entry
  getMoodEntry: async (id: string): Promise<MoodEntryResponse> => {
    const response = await apiClient.get<MoodEntryResponse>(
      `/mood-entries/${id}`
    );
    return response.data;
  },

  // Update mood entry
  updateMoodEntry: async (
    id: string,
    payload: Partial<CreateMoodEntryPayload>
  ): Promise<MoodEntryResponse> => {
    const response = await apiClient.patch<MoodEntryResponse>(
      `/mood-entries/${id}`,
      payload
    );
    return response.data;
  },

  // Delete mood entry
  deleteMoodEntry: async (id: string): Promise<void> => {
    await apiClient.delete(`/mood-entries/${id}`);
  },
};

export default moodApi;