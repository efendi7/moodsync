import React from 'react';
import { TrendingUp } from 'lucide-react';

interface MoodStatisticsCardsProps {
  statistics: any;
  isDarkMode: boolean;
}

export const MoodStatisticsCards: React.FC<MoodStatisticsCardsProps> = ({ statistics, isDarkMode }) => {
  const stats = [
    { 
      label: 'Total Entri', 
      value: statistics.totalEntries || 0, 
      icon: TrendingUp 
    },
    { 
      label: 'Rata-rata Mood', 
      value: `${(statistics.averageMood ?? 0).toFixed(1)}/5` 
    },
    { 
      label: 'Rata-rata Energi', 
      value: `${(statistics.averageEnergy ?? 0).toFixed(1)}/5` 
    },
    { 
      label: 'Rata-rata Bahagia', 
      value: `${(statistics.averageHappiness ?? 0).toFixed(1)}/5` 
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
            {item.icon && <item.icon className="w-8 h-8 text-purple-500 opacity-80" />}
          </div>
        </div>
      ))}
    </div>
  );
};