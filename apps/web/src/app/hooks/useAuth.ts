// src/app/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../../types';
import { authUtils } from '@/utils/authUtils';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      // Support multiple token keys untuk compatibility
      const token = authUtils.getToken() || 
                    localStorage.getItem('access_token') || 
                    localStorage.getItem('token');
      
      console.log('🔍 Fetching user profile...');
      console.log('Token found:', !!token);
      console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'none');
      
      if (!token) {
        console.warn('❌ No token found in localStorage');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }

      // Check if token is expired
      if (authUtils.isTokenExpired(token)) {
        console.warn('❌ Token is expired');
        authUtils.logout();
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Session expired',
        });
        return;
      }

      console.log('🔄 Making API request to:', `${API_BASE_URL}/users/profile`);
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ Unauthorized - Token invalid or expired');
          authUtils.logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }

      const userData = await response.json();
      console.log('✅ User data received:', userData);
      
      // Transform backend data to match frontend User interface
      const user: User = {
        id: userData.id,
        name: userData.full_name || userData.username || 'User',
        email: userData.email,
        avatar: userData.avatar_url || userData.profile_picture || userData.profilePicture || '👤',
        joinDate: userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        streakDays: userData.streakDays || 0,
        totalEntries: userData.totalEntries || 0,
        plan: (userData.subscription_plan?.toLowerCase() || 'free') as 'free' | 'premium' | 'pro',
        streak: userData.streak || userData.streakDays || 0,
        wellnessScore: userData.wellnessScore || 0,
      };

      console.log('✅ Transformed user data:', user);

      // Save user data to localStorage
      authUtils.setUser(userData);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      console.log('🔐 Attempting login for:', email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login successful:', data);

      // Save token using authUtils (consistent key)
      authUtils.setToken(data.access_token);
      
      // Also save to other keys for compatibility
      localStorage.setItem('access_token', data.access_token);
      
      if (data.user) {
        authUtils.setUser(data.user);
      }
      
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('❌ Login error:', errorMessage);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      const token = authUtils.getToken() || localStorage.getItem('access_token');
      
      if (token) {
        console.log('🚪 Logging out...');
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(err => console.warn('Logout API call failed:', err));
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      authUtils.logout();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      console.log('✅ Logged out successfully');
    }
  }, []);

  const refreshUser = useCallback(() => {
    return fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    // Log authentication state on mount
    console.group('🔐 Auth Hook Initialized');
    console.log('Token exists:', !!authUtils.getToken());
    console.log('User in localStorage:', authUtils.getUser());
    console.groupEnd();

    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    ...authState,
    login,
    logout,
    refreshUser,
  };
};