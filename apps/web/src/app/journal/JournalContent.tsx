// apps/web/src/app/(dashboard)/journal/JournalContent.tsx
'use client';

import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../hooks/useSidebar';
import { useDashboardContext } from '../contexts/DashboardContext';
import { useJournalData } from '@/hooks/journal/useJournalData';

import { Header } from '../layouts/Header';
import { Sidebar } from '../layouts/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { JournalHeader } from '@/components/journal/JournalHeader';
import { JournalStatisticsCards } from '@/components/journal/JournalStatisticsCards';
import { JournalList } from '@/components/journal/JournalList';
import { CreateJournalModal } from '@/components/journal/CreateJournalModal';
import { EditJournalModal } from '@/components/journal/EditJournalModal';

export const JournalContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isCollapsed, isOpen } = useSidebar();
  const { user, refreshData, isLoading: isDashboardLoading } = useDashboardContext();

  const {
    entries,
    statistics,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    selectedEntry,
    setSelectedEntry,
    loadEntries,
    loadStatistics,
    createEntry,
    updateEntry,
    deleteEntry,
  } = useJournalData();

  const handleRefresh = () => {
    refreshData();
    loadEntries();
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
          <JournalHeader
            isDarkMode={isDarkMode}
            onCreateClick={() => setIsModalOpen(true)}
          />

          {statistics && (
            <JournalStatisticsCards statistics={statistics} isDarkMode={isDarkMode} />
          )}

          <JournalList
            entries={entries}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
            onEdit={setSelectedEntry}
            onDelete={deleteEntry}
          />
        </main>
      </div>

      <CreateJournalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
        onSuccess={createEntry}
      />

      {selectedEntry && (
        <EditJournalModal
          isOpen={!!selectedEntry}
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          isDarkMode={isDarkMode}
          onSuccess={updateEntry}
        />
      )}
    </div>
  );
};