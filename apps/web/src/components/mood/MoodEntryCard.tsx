import React from 'react';
import { MoodEntryResponse } from '@/services/api/moodApi';
import { moodEmojis } from '@/utils/moodUtils';
import { formatDateDisplay } from '@/utils/dateUtils';

interface MoodEntryCardProps {
  entry: MoodEntryResponse;
  isDarkMode: boolean;
}

export const MoodEntryCard: React.FC<MoodEntryCardProps> = ({ entry, isDarkMode }) => {
  return (
    <div
      className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">
          {moodEmojis[entry.mood as keyof typeof moodEmojis] || '😐'}
        </div>
        <div className="flex-1">
          <p className="font-semibold capitalize text-lg">{entry.mood}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatDateDisplay(entry.date)}
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {entry.intensity}/10
          </p>
        </div>
      </div>

      {entry.note && (
        <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {entry.note}
        </p>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {entry.tags.map((tag: string) => (
            <span
              key={tag}
              className={`px-3 py-1 text-xs rounded-full ${
                isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};