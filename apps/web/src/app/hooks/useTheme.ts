// hooks/useTheme.ts
import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Initialize with a safe default for SSR
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // This runs only on client-side after hydration
    const getInitialTheme = (): boolean => {
      const savedTheme = localStorage.getItem('moodsync-theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Fallback to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme);
    setIsHydrated(true);

    // Apply theme to document
    if (initialTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Only run after hydration
    if (isHydrated) {
      localStorage.setItem('moodsync-theme', isDarkMode ? 'dark' : 'light');
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isHydrated]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return { isDarkMode, toggleTheme, isHydrated };
};