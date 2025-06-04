import React from 'react';
import { Card, Badge, IconButton } from '../ui';
import { Check, X } from 'lucide-react';
import { Habit } from '../../types';

interface HabitsProgressProps {
  habits: Habit[];
  isDarkMode: boolean;
}

export const HabitsProgress: React.FC<HabitsProgressProps> = ({
  habits,
  isDarkMode,
}) => {
  return (
    <Card isDarkMode={isDarkMode} className="p-6">
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Today's Habits
      </h3>
      
      <div className="space-y-3">
        {habits.map((habit, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
              isDarkMode 
                ? 'bg-gray-700/30 hover:bg-gray-600/40' 
                : 'bg-gray-100/80 hover:bg-gray-200/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <IconButton
                icon={habit.completed ? Check : X}
                variant={habit.completed ? 'gradient' : 'ghost'}
                size="sm"
                gradientColors="from-green-500 to-emerald-500"
              />
              
              <div>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {habit.name}
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Target: {habit.target}
                </p>
              </div>
            </div>
            
            <Badge
              variant={habit.completed ? 'success' : 'warning'}
              size="sm"
            >
              {habit.streak} day streak
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};