import React from 'react';
import { QuickAction } from '../../types';

interface QuickActionsProps {
  actions: QuickAction[];
  isDarkMode: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, isDarkMode }) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800/50" : "bg-white/70"
      } backdrop-blur-sm rounded-2xl border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } p-6`}
    >
      <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-200 hover:border-gray-300"
            } transition-all group hover:scale-105`}
          >
            <div
              className={`bg-gradient-to-r ${action.color} rounded-lg p-3 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              <div className="text-white">{action.icon}</div>
            </div>
            <p className="font-medium text-sm">{action.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};