import React from 'react';
import { Card, Badge } from '../ui';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';
import { User } from '../../types';

interface StatsCardsProps {
  user: User;
  todayProgress: number;
  isDarkMode: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  user,
  todayProgress,
  isDarkMode,
}) => {
  const stats = [
    {
      title: 'Wellness Score',
      value: user.wellnessScore.toFixed(1),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      change: '+0.2 from yesterday',
    },
    {
      title: 'Current Streak',
      value: `${user.streak} days`,
      icon: <Award className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      change: 'Personal best!',
    },
    {
      title: 'Today Progress',
      value: `${todayProgress}%`,
      icon: <Target className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      change: '3 of 5 goals',
    },
    {
      title: 'Energy Level',
      value: 'High',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      change: 'Peak at 2 PM',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} isDarkMode={isDarkMode} hover className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}
            >
              {stat.icon}
            </div>
            <Badge variant="info" size="sm">
              Live
            </Badge>
          </div>

          <div className="space-y-2">
            <p
              className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {stat.title}
            </p>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {stat.value}
            </p>
            <p
              className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              {stat.change}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
