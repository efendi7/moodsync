// src/app/layout.tsx

'use client'; 

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, useTheme } from '@/app/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Komponen baru untuk menerapkan class tema dan mencegah flash
function ThemedBody({ children }: { children: React.ReactNode }) {
  const { isDarkMode, hasMounted } = useTheme();

  // Selalu render tag <body> untuk menghindari error.
  // Kelas tema hanya diterapkan setelah mounting untuk menghindari hydration mismatch.
  const themeClass = hasMounted && isDarkMode ? 'dark' : '';

  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased ${themeClass}`}
    >
      {children}
      {/* Toast Notifications - Positioned at top-right */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 4000,
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827',
            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: isDarkMode 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          // Success toast
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          // Error toast
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          // Loading toast
          loading: {
            iconTheme: {
              primary: '#8b5cf6',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!GOOGLE_CLIENT_ID) {
    console.error('Environment variable NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set.');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider>
        {GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ThemedBody>{children}</ThemedBody>
          </GoogleOAuthProvider>
        ) : (
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
              <p>Error: Google login is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.</p>
            </div>
          </body>
        )}
      </ThemeProvider>
    </html>
  );
}