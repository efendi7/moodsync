// src/app/contexts/DashboardContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import type {
  User,
  Insight,
  QuickAction,
  RecentMood,
  Habit,
} from '../../types';

interface DashboardContextType {
  user: User;
  todayProgress: number;
  insights: Insight[];
  quickActions: QuickAction[];
  recentMoods: RecentMood[];
  habits: Habit[];
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user: authUser, isLoading: authLoading, logout: authLogout, error: authError } = useAuth();
  const mockData = useDashboardData();
  
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    // Debug logs
    console.group('🔍 DashboardContext State');
    console.log('authLoading:', authLoading);
    console.log('authUser:', authUser);
    console.log('authError:', authError);
    console.log('Using real data:', !!authUser);
    console.log('Using mock data:', !authUser);
    console.groupEnd();

    // Set loading false when auth is done
    if (!authLoading) {
      setIsDataLoading(false);
    }
  }, [authLoading, authUser, authError]);

  const refreshData = () => {
    console.log('🔄 Refreshing dashboard data...');
    window.location.reload();
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    await authLogout();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  // CRITICAL: Check if we have real user data
  // If authUser is null but not loading, redirect to login
  useEffect(() => {
    if (!authLoading && !authUser && !authError) {
      console.warn('⚠️ No user data and not loading - should redirect to login');
      // Uncomment to enable auto-redirect:
      // window.location.href = '/auth/login';
    }
  }, [authLoading, authUser, authError]);

  // Use real user data if available, otherwise use mock (but log warning)
  let user: User;
  if (authUser) {
    console.log('✅ Using REAL user data from backend');
    user = authUser;
  } else {
    console.warn('⚠️ Using MOCK user data - authUser is null');
    user = mockData.user;
  }
  
  const value = {
    user,
    todayProgress: mockData.todayProgress,
    insights: mockData.insights,
    quickActions: mockData.quickActions,
    recentMoods: mockData.recentMoods,
    habits: mockData.habits,
    isLoading: authLoading || isDataLoading,
    logout,
    refreshData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider',
    );
  }
  return context;
};