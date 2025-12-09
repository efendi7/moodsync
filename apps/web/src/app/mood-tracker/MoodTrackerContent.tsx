'use client';

import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../hooks/useSidebar';
import { useDashboardContext } from '../contexts/DashboardContext';
import { useMoodTrackerState } from '@/hooks/mood/useMoodTrackerState';
import { useMoodTrackerData } from '@/hooks/mood/useMoodTrackerData';
import { getThemeClasses } from '@/utils/mood/styleUtils';

import { Header } from '../layouts/Header';
import { Sidebar } from '../layouts/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MoodTrackerHeader } from '@/components/mood/MoodTrackerHeader';
import { MoodStatisticsCards } from '@/components/mood/MoodStatisticCards';
import { MoodInputSection } from '@/components/mood/MoodInputSection';
import { RecentEntriesSection } from '@/components/mood/RecentEntriesSection';


export const MoodTrackerContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isCollapsed, isOpen } = useSidebar();
  const { user, refreshData, isLoading: isDashboardLoading } = useDashboardContext();

  const moodState = useMoodTrackerState();
  const { moodEntries, statistics, isLoadingEntries, loadMoodEntries, loadStatistics } = 
    useMoodTrackerData();

  const handleRefresh = () => {
    refreshData();
    loadMoodEntries();
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
          <MoodTrackerHeader isDarkMode={isDarkMode} />

          {statistics && (
            <MoodStatisticsCards statistics={statistics} isDarkMode={isDarkMode} />
          )}

          <MoodInputSection
            moodState={moodState}
            isDarkMode={isDarkMode}
            onSaveSuccess={() => {
              loadMoodEntries();
              loadStatistics();
            }}
          />

          <RecentEntriesSection
            entries={moodEntries}
            isLoading={isLoadingEntries}
            isDarkMode={isDarkMode}
          />
        </main>
      </div>
    </div>
  );
};


