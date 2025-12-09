// src/app/layouts/Header.tsx
'use client';

import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings,
  Menu,
} from 'lucide-react';
import { User } from '../../types';
import { useSidebar } from '@/app/hooks/useSidebar';

interface HeaderProps {
  user: User;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onRefresh?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isDarkMode,
  toggleTheme,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { toggle } = useSidebar();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 h-16 border-b ${
        isDarkMode
          ? 'bg-gray-900/90 backdrop-blur-xl border-gray-700'
          : 'bg-white/90 backdrop-blur-xl border-gray-200'
      }`}
    >
      {/* Full width container — mulai dari sisi kiri sidebar */}
      <div className="flex h-full items-center justify-end px-4 sm:px-6 lg:px-8">
        {/* Hamburger — hanya muncul di mobile */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg lg:hidden text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-100/10"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* SPACER BESAR — dorong semua icon ke kanan */}
        <div className="flex-1" />

        {/* ICON KANAN — selalu di paling kanan */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-800/50 dark:hover:bg-gray-100/10 transition">
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-800/50 dark:hover:bg-gray-100/10 transition"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-800/50 dark:hover:bg-gray-100/10 transition"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              )}

              <div className="hidden md:block text-left">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.streak || 0} day streak
                </p>
              </div>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-2xl ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-purple-500 mt-1">
                      {user.plan ? `${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)} Plan` : 'Free Plan'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      <UserIcon className="h-4 w-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="h-4 w-4" /> Settings
                    </button>
                  </div>
                  <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};