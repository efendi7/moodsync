import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HabitResponse } from '@/services/api/habitsApi';
import { HabitCard } from './HabitCard';

interface HabitsListProps {
  habits: HabitResponse[];
  isLoading: boolean;
  isDarkMode: boolean;
  onHabitUpdated: () => void;
}

export const HabitsList: React.FC<HabitsListProps> = ({
  habits,
  isLoading,
  isDarkMode,
  onHabitUpdated,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div
        className={`backdrop-blur-lg rounded-2xl p-12 shadow-lg border text-center ${
          isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}
      >
        <p className="text-xl text-gray-500">
          Belum ada habit. Mulai buat habit pertamamu!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isDarkMode={isDarkMode}
          onUpdate={onHabitUpdated}
        />
      ))}
    </div>
  );
};