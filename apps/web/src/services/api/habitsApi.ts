import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authUtils } from '@/utils/authUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────
//  REQUEST INTERCEPTOR
// ─────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authUtils.getToken();

    if (token) {
      // Cek token expired
      if (authUtils.isTokenExpired(token)) {
        authUtils.logout();
        authUtils.redirectToLogin();
        return Promise.reject(new Error('Token expired'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────
//  RESPONSE INTERCEPTOR
// ─────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const isAuthPage =
      typeof window !== 'undefined' &&
      window.location.pathname.includes('/auth');

    // Jika token invalid/expired
    if (error.response?.status === 401 && !isAuthPage) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // 🔄 Jika kamu punya refresh token: aktifkan bagian ini
        /*
        try {
          const newToken = await authUtils.refreshToken();
          authUtils.saveToken(newToken);

          apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return apiClient(originalRequest);
        } catch (e) {
          authUtils.logout();
          authUtils.redirectToLogin();
        }
        */

        // ❌ Jika kamu TIDAK punya refresh token (default)
        authUtils.logout();
        authUtils.redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────
//  TIPE DATA
// ─────────────────────────────

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export interface FrequencyValue {
  daysOfWeek?: number[];
  timesPerWeek?: number;
  customPattern?: string;
}

export interface CreateHabitPayload {
  name: string;
  description?: string;
  category: string;
  frequencyType: FrequencyType;
  frequencyValue?: FrequencyValue;
  difficultyLevel: number;
  targetValue?: number;
  unit?: string;
  reminderTime?: string;
}

export interface HabitResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequencyType: FrequencyType;
  frequencyValue?: FrequencyValue;
  difficultyLevel: number;
  targetValue?: number;
  unit?: string;
  reminderTime?: string;
  streakCount: number;
  bestStreak: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogHabitPayload {
  date: string;
  completed: boolean;
  valueAchieved?: number;
  notes?: string;
  moodBefore?: number;
  moodAfter?: number;
}

export interface HabitLogResponse {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  valueAchieved?: number;
  notes?: string;
  moodBefore?: number;
  moodAfter?: number;
  createdAt: Date;
}

export interface HabitStatistics {
  totalHabits: number;
  activeHabits: number;
  totalLogs: number;
  completedLogs: number;
  completionRate: number;
  averageStreak: number;
  bestStreak: number;
  categoryBreakdown: Array<{
    category: string;
    total: number;
    completed: number;
    rate: number;
  }>;
}

interface BackendResponse<T> {
  success: boolean;
  data: T;
  total?: number;
}

// ─────────────────────────────
//  API FUNCTIONS
// ─────────────────────────────
export const habitsApi = {
  // Create Habit
  createHabit: async (payload: CreateHabitPayload): Promise<HabitResponse> => {
    const response = await apiClient.post<BackendResponse<HabitResponse>>(
      '/habits',
      payload
    );
    return response.data.data;
  },

  // Get all habits
  getHabits: async (filters?: {
    category?: string;
    isActive?: boolean;
  }): Promise<HabitResponse[]> => {
    const response = await apiClient.get<BackendResponse<HabitResponse[]>>(
      '/habits',
      { params: filters }
    );
    return response.data.data;
  },

  // Get single habit
  getHabit: async (id: string): Promise<HabitResponse> => {
    const response = await apiClient.get<BackendResponse<HabitResponse>>(
      `/habits/${id}`
    );
    return response.data.data;
  },

  // Update habit
  updateHabit: async (
    id: string,
    payload: Partial<CreateHabitPayload>
  ): Promise<HabitResponse> => {
    const response = await apiClient.patch<BackendResponse<HabitResponse>>(
      `/habits/${id}`,
      payload
    );
    return response.data.data;
  },

  // ──────────────── LOG HABIT ────────────────
logHabit: async (habitId: string, payload: LogHabitPayload): Promise<HabitLogResponse> => {
  const response = await apiClient.post<BackendResponse<HabitLogResponse>>(
    `/habits/${habitId}/logs`,
    payload
  );
  return response.data.data;
},

getHabitLogs: async (habitId: string): Promise<HabitLogResponse[]> => {
  const response = await apiClient.get<BackendResponse<HabitLogResponse[]>>(
    `/habits/${habitId}/logs`
  );
  return response.data.data;
},

getStatistics: async (days: number = 30): Promise<HabitStatistics> => {
  const response = await apiClient.get<BackendResponse<HabitStatistics>>(
    '/habits/statistics',
    { params: { days } }
  );
  return response.data.data;
},



};



