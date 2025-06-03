import React from "react";
import { Heart, Target, Activity, Zap } from "lucide-react";
import { User } from "../../types";

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
  const cardClass = `${
    isDarkMode ? "bg-gray-800/50" : "bg-white/70"
  } backdrop-blur-sm rounded-2xl border ${
    isDarkMode ? "border-gray-700" : "border-gray-200"
  } p-6`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span
            className={`text-2xl font-bold ${
              user.wellnessScore >= 8
                ? "text-green-400"
                : user.wellnessScore >= 6
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {user.wellnessScore}
          </span>
        </div>
        <h3 className="font-semibold mb-1">Wellness Score</h3>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Great improvement!
        </p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-green-400">
            {user.streak}
          </span>
        </div>
        <h3 className="font-semibold mb-1">Day Streak</h3>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Personal record!
        </p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-400">
            {todayProgress}%
          </span>
        </div>
        <h3 className="font-semibold mb-1">Today's Progress</h3>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          3 of 4 habits done
        </p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-orange-400">High</span>
        </div>
        <h3 className="font-semibold mb-1">Energy Level</h3>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Peak at 2 PM
        </p>
      </div>
    </div>
  );
};