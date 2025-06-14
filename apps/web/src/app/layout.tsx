// src/app/layout.tsx
'use client'; // This directive is necessary for client components in Next.js App Router

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// REMOVED: export const metadata: Metadata = { ... };
// Metadata can only be exported from Server Components.
// If you need global metadata, define it in a separate layout.ts/tsx file
// that is a Server Component, or in individual page.tsx files.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Retrieve the Google Client ID from environment variables.
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!GOOGLE_CLIENT_ID) {
    console.error('Environment variable NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set.');
    // You could render an error page or a fallback UI here if the ID is critical
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap your entire application (children) with GoogleOAuthProvider */}
        {GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {children}
          </GoogleOAuthProvider>
        ) : (
          // Fallback content if GOOGLE_CLIENT_ID is not set.
          <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
            <p>Error: Google login is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.</p>
          </div>
        )}
      </body>
    </html>
  );
}
