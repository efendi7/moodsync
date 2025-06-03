// src/app/layouts/Header.tsx

import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  isDarkMode: boolean;
  toggleTheme: () => void;
  // isSidebarCollapsed is not needed here as the parent div in MoodSyncDashboard
  // handles the left margin based on sidebar state.
}

export const Header: React.FC<HeaderProps> = ({ user, isDarkMode, toggleTheme }) => {
  return (
    <header
      className={`
        sticky top-0 z-30
        ${
          // Background and backdrop-blur remain on the header tag
          isDarkMode
            ? "bg-gray-900/90 backdrop-blur-xl"
            : "bg-white/90 backdrop-blur-xl"
        }
      `}
    >
      {/*
        This inner div will now be responsible for:
        1. Setting a fixed height of h-16 (64px) to match the sidebar header.
        2. Applying the bottom border.
        3. Containing and centering its content using flex properties.
      */}
      <div
        className={`
          px-6 h-16 flex items-center justify-between
          border-b
          ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        `}
      >
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-purple-400 font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            Mood Tracker
          </a>
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            Habits
          </a>
          <a
            href="#"
            className={`${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            Analytics
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            } transition-colors`}
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            } transition-colors`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{user.avatar}</div>
            <div className="hidden md:block">
              <div className="font-medium">{user.name}</div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {user.streak} day streak
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};