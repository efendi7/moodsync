import React from 'react';
import { Calendar } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MoodEntryResponse } from '@/services/api/moodApi';
import { MoodEntryCard } from './MoodEntryCard';

interface RecentEntriesSectionProps {
  entries: MoodEntryResponse[];
  isLoading: boolean;
  isDarkMode: boolean;
}

export const RecentEntriesSection: React.FC<RecentEntriesSectionProps> = ({ 
  entries, 
  isLoading, 
  isDarkMode 
}) => {
  return (
    <div
      className={`backdrop-blur-lg rounded-2xl p-8 shadow-lg border ${
        isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Entri Terbaru (7 Hari)</h3>
        <Calendar className="w-6 h-6 text-purple-500" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-center py-12 text-gray-500">
          Belum ada entri mood. Mulai catat mood kamu di atas!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <MoodEntryCard key={entry.id} entry={entry} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}
    </div>
  );
};