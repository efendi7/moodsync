import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Habit } from '../../types';

interface HabitsProgressProps {
  habits: Habit[];
  isDarkMode: boolean;
}

export const HabitsProgress: React.FC<HabitsProgressProps> = ({ habits, isDarkMode }) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800/50" : "bg-white/70"
      } backdrop-blur-sm rounded-2xl border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } p-6`}
    >
      <h2 className="text-xl font-bold mb-6">Today's Habits</h2>
      <div className="space-y-4">
        {habits.map((habit, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  habit.completed
                    ? "bg-green-500 border-green-500"
                    : isDarkMode
                    ? "border-gray-600"
                    : "border-gray-300"
                }`}
              >
                {habit.completed && <CheckCircle className="w-4 h-4 text-white" />}
              </button>
              <div>
                <div
                  className={`font-medium text-sm ${
                    habit.completed ? "line-through opacity-75" : ""
                  }`}
                >
                  {habit.name}
                </div>
                <div
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {habit.streak} day streak • {habit.target}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium">
        View All Habits →
      </button>
    </div>
  );
};