import React from 'react';
import { Brain } from 'lucide-react';
import { Insight } from '../../types';

interface AIInsightsProps {
  insights: Insight[];
  isDarkMode: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights, isDarkMode }) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800/50" : "bg-white/70"
      } backdrop-blur-sm rounded-2xl border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } p-6`}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <Brain className="w-6 h-6 text-purple-400" />
        Today's AI Insights
      </h2>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-200 hover:border-gray-300"
            } transition-colors group cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg ${
                  insight.type === "prediction"
                    ? "bg-blue-500/20 text-blue-400"
                    : insight.type === "recommendation"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {insight.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p
                  className={`text-sm mb-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {insight.description}
                </p>
                <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  {insight.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};