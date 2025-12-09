// src/app/dashboard/page.tsx
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
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../hooks/useSidebar';
import {
  DashboardProvider,
  useDashboardContext,
} from '../contexts/DashboardContext';

const DashboardContent = () => {
  // SEMUA HOOK HARUS DI ATAS — TIDAK BOLEH ADA RETURN/IF DI ATASNYA
  const { isDarkMode, toggleTheme } = useTheme();
  const { isCollapsed, isOpen } = useSidebar();

  const {
    user,
    todayProgress,
    insights,
    quickActions,
    recentMoods,
    habits,
    isLoading,
    refreshData,
    logout,
  } = useDashboardContext();

  const [currentMood, setCurrentMood] = useState<number | null>(null);

  // Background sesuai tema
  const themeClasses = useMemo(
    () =>
      isDarkMode
        ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
        : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900',
    [isDarkMode]
  );

  // Margin kiri konten utama (mobile = 0, desktop = sesuai sidebar)
  const mainContentMargin = useMemo(() => {
    if (isOpen) return 'lg:ml-64';
    return isCollapsed ? 'lg:ml-20' : 'lg:ml-64';
  }, [isOpen, isCollapsed]);

  const handleMoodChange = useCallback((mood: number | null) => {
    setCurrentMood(mood);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Loading harus di bawah semua hook
  if (isLoading) {
    return (
      <div
        className={
          isDarkMode
            ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center'
            : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center'
        }
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={themeClasses}>
      {/* Sidebar – otomatis jadi drawer di mobile */}
      <Sidebar isDarkMode={isDarkMode} />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${mainContentMargin} pt-16`}>
  <Header
    user={user}
    isDarkMode={isDarkMode}
    toggleTheme={toggleTheme}
    onRefresh={handleRefresh}
    onLogout={handleLogout}
  />

       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <WelcomeSection userName={user.name} isDarkMode={isDarkMode} />

          <StatsCards
            user={user}
            todayProgress={todayProgress}
            isDarkMode={isDarkMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
            {/* Kolom Kiri */}
            <section className="lg:col-span-2 space-y-8">
              <DailyCheckIn
                currentMood={currentMood}
                setCurrentMood={handleMoodChange}
                isDarkMode={isDarkMode}
              />
              <AIInsights insights={insights} isDarkMode={isDarkMode} />
            </section>

            {/* Kolom Kanan */}
            <aside className="space-y-8">
              <QuickActions actions={quickActions} isDarkMode={isDarkMode} />
              <RecentMoods moods={recentMoods} isDarkMode={isDarkMode} />
              <HabitsProgress habits={habits} isDarkMode={isDarkMode} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

// Wrapper dengan DashboardProvider
const MoodSyncDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default MoodSyncDashboard;