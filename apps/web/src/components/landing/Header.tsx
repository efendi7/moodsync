import React from 'react';
import Link from 'next/link';
import { Heart, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, isDarkMode, toggleTheme }) => {
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? 'bg-gray-900/90 backdrop-blur-xl'
            : 'bg-white/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MoodSync
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {/* Tautan Home baru */}
          <Link
            href="/" // Path ke homepage
            className={`${
              isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/#features"
            className={`${
              isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className={`${
              isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={`${
              isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            } transition-colors`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <Link
            href="/auth/login"
            className={`${
              isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors cursor-pointer font-medium`}
          >
            Log in
          </Link>

          <Link
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;