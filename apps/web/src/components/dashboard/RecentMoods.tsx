import React from 'react';
import { RecentMood } from '../../types';

interface RecentMoodsProps {
  moods: RecentMood[];
  isDarkMode: boolean;
}

export const RecentMoods: React.FC<RecentMoodsProps> = ({ moods, isDarkMode }) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800/50" : "bg-white/70"
      } backdrop-blur-sm rounded-2xl border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } p-6`}
    >
      <h2 className="text-xl font-bold mb-6">Recent Moods</h2>
      <div className="space-y-3">
        {moods.map((mood, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mood.mood}</span>
              <div>
                <div className="font-medium text-sm">{mood.date}</div>
                <div
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {mood.time}
                </div>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                mood.score >= 8
                  ? "bg-green-500/20 text-green-400"
                  : mood.score >= 6
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {mood.score}/10
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium">
        View All Moods →
      </button>
    </div>
  );
};
