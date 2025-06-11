import React, { createContext, useContext, ReactNode } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import type {
  User,
  Insight,
  QuickAction,
  RecentMood,
  Habit,
} from '../../hooks/useDashboardData';

interface DashboardContextType {
  // Data from useDashboardData
  user: User;
  todayProgress: number;
  insights: Insight[];
  quickActions: QuickAction[];
  recentMoods: RecentMood[];
  habits: Habit[];
  isLoading: boolean;

  // Additional context methods
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Use the dashboard data hook
  const dashboardData = useDashboardData();

  const refreshData = () => {
    // Implement data refresh logic
    console.log('Refreshing dashboard data...');
    // In a real app, you might trigger a re-fetch here
    window.location.reload(); // Simple refresh - replace with better logic
  };

  const value = {
    ...dashboardData, // Spread all dashboard data
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
