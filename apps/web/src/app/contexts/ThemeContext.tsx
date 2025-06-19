// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Perbaikan kecil: Tambahkan blok try-catch untuk penanganan error parsing yang lebih robust
      if (savedTheme !== null) {
        try {
          // Hanya mencoba parse jika ada nilai, dan pastikan itu boolean
          const parsedTheme = JSON.parse(savedTheme);
          if (typeof parsedTheme === 'boolean') {
            return parsedTheme;
          }
        } catch (e) {
          console.error("Failed to parse theme from localStorage, falling back to default.", e);
          // Fallback jika parsing gagal (misalnya, "dark" bukan JSON valid)
        }
      }
      return true; // Default dark mode jika tidak ada tema tersimpan atau parsing gagal
    }
    return true; // Default dark mode untuk SSR
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};