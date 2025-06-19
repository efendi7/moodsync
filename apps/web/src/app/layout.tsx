// src/app/layout.tsx
'use client'; // This directive is necessary for client components in Next.js App Router

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import { ThemeProvider } from '@/app/contexts/ThemeContext'; // Import ThemeProvider yang baru Anda buat

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {GOOGLE_CLIENT_ID ? (
          // Bungkus GoogleOAuthProvider dan children dengan ThemeProvider
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ThemeProvider> {/* Tambahkan ThemeProvider di sini */}
              {children}
            </ThemeProvider>
          </GoogleOAuthProvider>
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
            <p>Error: Google login is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.</p>
          </div>
        )}
      </body>
    </html>
  );
}