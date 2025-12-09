'use client';

import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../hooks/useSidebar';
import { useDashboardContext } from '../contexts/DashboardContext';
import { useHabitsData } from '@/hooks/habits/useHabitsData';

import { Header } from '../layouts/Header';
import { Sidebar } from '../layouts/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HabitsHeader } from '@/components/habits/HabitsHeader';
import { HabitsStatisticsCards } from '@/components/habits/HabitsStatisticsCards';
import { HabitsList } from '@/components/habits/HabitsList';
import { CreateHabitModal } from '@/components/habits/CreateHabitModal';

export const HabitsContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isCollapsed, isOpen } = useSidebar();
  const { user, refreshData, isLoading: isDashboardLoading } = useDashboardContext();

  const {
    habits,
    statistics,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    loadHabits,
    loadStatistics,
  } = useHabitsData();

  const handleRefresh = () => {
    refreshData();
    loadHabits();
    loadStatistics();
  };

  const themeClasses = isDarkMode
    ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900';

  const mainContentMargin = isOpen ? 'lg:ml-64' : (isCollapsed ? 'lg:ml-20' : 'lg:ml-64');

  if (isDashboardLoading) {
    return (
      <div className={`${themeClasses} flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={themeClasses}>
      <Sidebar isDarkMode={isDarkMode} />

      <div className={`transition-all duration-300 ${mainContentMargin} pt-16`}>
        <Header
          user={user}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onRefresh={handleRefresh}
        />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <HabitsHeader
            isDarkMode={isDarkMode}
            onCreateClick={() => setIsModalOpen(true)}
          />

          {statistics && (
            <HabitsStatisticsCards statistics={statistics} isDarkMode={isDarkMode} />
          )}

          <HabitsList
            habits={habits}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
            onHabitUpdated={() => {
              loadHabits();
              loadStatistics();
            }}
          />
        </main>
      </div>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
        onSuccess={() => {
          loadHabits();
          loadStatistics();
        }}
      />
    </div>
  );
};