import React, { useState } from 'react';
import { CheckCircle, Flame, Target, TrendingUp, MoreVertical } from 'lucide-react';
import { HabitResponse } from '@/services/api/habitsApi';
import { habitsApi } from '@/services/api/habitsApi';
import { toast } from 'react-hot-toast';
import { LogHabitModal } from './LogHabitModal';

interface HabitCardProps {
  habit: HabitResponse;
  isDarkMode: boolean;
  onUpdate: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isDarkMode, onUpdate }) => {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const handleQuickLog = async () => {
    setIsLogging(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await habitsApi.logHabit(habit.id, {
        date: today,
        completed: true,
      });
      toast.success('Habit berhasil dicatat!');
      onUpdate();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Habit sudah dicatat hari ini');
      } else {
        toast.error('Gagal mencatat habit');
      }
    } finally {
      setIsLogging(false);
    }
  };

  const difficultyColors = {
    1: 'bg-green-500',
    2: 'bg-blue-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  };

  return (
    <>
      <div
        className={`backdrop-blur-lg rounded-2xl p-6 shadow-lg border ${
          isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{habit.name}</h3>
            {habit.description && (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {habit.description}
              </p>
            )}
          </div>
          <button
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Category & Frequency */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}
          >
            {habit.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {habit.frequencyType}
          </span>
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Kesulitan
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded ${
                  level <= habit.difficultyLevel
                    ? difficultyColors[habit.difficultyLevel as keyof typeof difficultyColors]
                    : isDarkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Streak
              </p>
            </div>
            <p className="text-2xl font-bold">{habit.streakCount}</p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Best
              </p>
            </div>
            <p className="text-2xl font-bold">{habit.bestStreak}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleQuickLog}
            disabled={isLogging}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {isLogging ? 'Mencatat...' : 'Selesai'}
          </button>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Detail
          </button>
        </div>
      </div>

      <LogHabitModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        habit={habit}
        isDarkMode={isDarkMode}
        onSuccess={onUpdate}
      />
    </>
  );
};