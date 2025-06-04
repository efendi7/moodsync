'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Header } from '../layouts/Header';
import { Sidebar } from '../layouts/Sidebar';
import { WelcomeSection } from '../../components/dashboard/WelcomeSection';
import { StatsCards } from '../../components/dashboard/StatsCards';
import { DailyCheckIn } from '../../components/dashboard/DailyCheckIn/DailyCheckin';
import { AIInsights } from '../../components/dashboard/AIInsight';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { RecentMoods } from '../../components/dashboard/RecentMoods';
import { HabitsProgress } from '../../components/dashboard/HabitsProgress';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../hooks/useSidebar';
import {
  DashboardProvider,
  useDashboardContext,
} from '../contexts/DashboardContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const DashboardLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

const DashboardContent = () => {
  const { isDarkMode, toggleTheme, isHydrated } = useTheme();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();

  const {
    user,
    todayProgress,
    insights,
    quickActions,
    recentMoods,
    habits,
    isLoading,
    refreshData,
  } = useDashboardContext();

  const [currentMood, setCurrentMood] = useState<number | null>(null);

  const themeClasses = useMemo(() => {
    const effectiveTheme = isHydrated ? isDarkMode : false;
    return effectiveTheme
      ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
      : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900';
  }, [isDarkMode, isHydrated]);

  const mainContentClasses = useMemo(
    () =>
      `transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`,
    [isSidebarCollapsed],
  );

  const handleMoodChange = useCallback((mood: number | null) => {
    setCurrentMood(mood);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  if (!isHydrated || isLoading) {
    return <DashboardLoader />;
  }

  const effectiveTheme = isDarkMode;

  return (
    <div className={themeClasses}>
      <Sidebar
        isDarkMode={effectiveTheme}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={toggleSidebar}
      />

      <div className={mainContentClasses}>
        <Header
          user={user}
          isDarkMode={effectiveTheme}
          toggleTheme={toggleTheme}
          onRefresh={handleRefresh}
        />

        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <WelcomeSection userName={user.name} isDarkMode={effectiveTheme} />

          <StatsCards
            user={user}
            todayProgress={todayProgress}
            isDarkMode={effectiveTheme}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-8">
              <DailyCheckIn
                currentMood={currentMood}
                setCurrentMood={handleMoodChange}
                isDarkMode={effectiveTheme}
              />

              <AIInsights insights={insights} isDarkMode={effectiveTheme} />
            </section>

            <aside className="space-y-8">
              <QuickActions
                actions={quickActions}
                isDarkMode={effectiveTheme}
              />
              <RecentMoods moods={recentMoods} isDarkMode={effectiveTheme} />
              <HabitsProgress habits={habits} isDarkMode={effectiveTheme} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

const MoodSyncDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default MoodSyncDashboard;
