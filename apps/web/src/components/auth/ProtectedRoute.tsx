// apps/web/src/components/auth/ProtectedRoute.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authUtils } from '@/utils/authUtils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're on an auth page (login, register, etc)
      const isAuthPage = pathname?.includes('/auth');
      
      if (isAuthPage) {
        // Jika sudah login dan mencoba akses halaman auth, redirect ke dashboard
        if (authUtils.isAuthenticated() && !authUtils.isTokenExpired()) {
          router.push('/dashboard');
          return;
        }
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // Check authentication for protected pages
      const token = authUtils.getToken();
      
      if (!token) {
        console.warn('No token found, redirecting to login...');
        router.push('/auth/login');
        setIsChecking(false);
        return;
      }

      // Check if token is expired
      if (authUtils.isTokenExpired(token)) {
        console.warn('Token expired, redirecting to login...');
        authUtils.logout();
        router.push('/auth/login');
        setIsChecking(false);
        return;
      }

      // Token valid
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !pathname?.includes('/auth')) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};