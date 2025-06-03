// hooks/useTheme.ts
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const themeClasses = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900";

  return {
    isDarkMode,
    toggleTheme,
    themeClasses
  };
};