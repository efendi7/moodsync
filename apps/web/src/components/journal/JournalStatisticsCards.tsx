import React from 'react';
import { BookOpen, TrendingUp, Flame, Tag } from 'lucide-react';
import { JournalStatistics } from '@/services/api/journalApi';

interface JournalStatisticsCardsProps {
  statistics: JournalStatistics;
  isDarkMode: boolean;
}

export const JournalStatisticsCards: React.FC<JournalStatisticsCardsProps> = ({
  statistics,
  isDarkMode,
}) => {
  const cardBg = isDarkMode
    ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700'
    : 'bg-white/70 backdrop-blur-lg border border-gray-200';

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Entries',
      value: statistics.totalEntries,
      subtext: `${statistics.entriesThisMonth} bulan ini`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Mood Improvement',
      value: statistics.moodImprovement > 0 ? `+${statistics.moodImprovement.toFixed(1)}` : statistics.moodImprovement.toFixed(1),
      subtext: `Dari ${statistics.averageMoodBefore.toFixed(1)} → ${statistics.averageMoodAfter.toFixed(1)}`,
      color: statistics.moodImprovement >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: statistics.moodImprovement >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: statistics.currentStreak,
      subtext: `Terbaik: ${statistics.longestStreak} hari`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Tag,
      label: 'Most Used Tag',
      value: statistics.mostUsedTags[0]?.tag || 'N/A',
      subtext: `${statistics.mostUsedTags[0]?.count || 0}x digunakan`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${cardBg} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.bgColor} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.label}
          </h3>
          <p className="text-3xl font-bold mb-1">{stat.value}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {stat.subtext}
          </p>
        </div>
      ))}
    </div>
  );
};