import React from 'react';
import { Target, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { HabitStatistics } from '@/services/api/habitsApi';

interface HabitsStatisticsCardsProps {
  statistics: HabitStatistics;
  isDarkMode: boolean;
}

export const HabitsStatisticsCards: React.FC<HabitsStatisticsCardsProps> = ({
  statistics,
  isDarkMode,
}) => {
  const stats = [
    {
      label: 'Total Habits',
      value: statistics.totalHabits,
      icon: Target,
      color: 'text-blue-500',
    },
    {
      label: 'Tingkat Penyelesaian',
      value: `${statistics.completionRate}%`,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Rata-rata Streak',
      value: `${statistics.averageStreak} hari`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      label: 'Best Streak',
      value: `${statistics.bestStreak} hari`,
      icon: Award,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((item, i) => (
        <div
          key={i}
          className={`backdrop-blur-lg rounded-2xl p-6 shadow-lg border ${
            isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </p>
              <p className="text-3xl font-bold mt-1">{item.value}</p>
            </div>
            <item.icon className={`w-8 h-8 ${item.color} opacity-80`} />
          </div>
        </div>
      ))}
    </div>
  );
};