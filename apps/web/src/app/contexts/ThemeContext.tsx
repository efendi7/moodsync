// src/app/contexts/ThemeContext.tsx

'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Tentukan tipe untuk data konteks
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  // Tambahkan state untuk memastikan tidak ada hydration error
  hasMounted: boolean; 
}

// Buat konteks dengan nilai default
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Buat komponen Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Efek ini hanya berjalan sekali di sisi klien setelah render awal
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Tentukan tema awal berdasarkan penyimpanan atau preferensi sistem
    // Default ke false (light mode) jika tidak ada yang diset
    const initialTheme = savedTheme !== null ? savedTheme === 'true' : prefersDark;

    setIsDarkMode(initialTheme);
    if (initialTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Tandai bahwa komponen sudah terpasang di klien
    setHasMounted(true);
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali

  const toggleTheme = () => {
    // Hanya izinkan pengubahan tema setelah komponen terpasang
    if (!hasMounted) return;

    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', String(newMode));
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  // Nilai yang akan diberikan ke provider
  const value = { isDarkMode, toggleTheme, hasMounted };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook kustom untuk menggunakan ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};