// apps/web/src/utils/authUtils.ts

/**
 * Utility functions untuk manajemen authentication
 */

// Key untuk menyimpan token
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const authUtils = {
  /**
   * Simpan access token
   */
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Ambil access token
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Simpan refresh token
   */
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  /**
   * Ambil refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  /**
   * Simpan user data
   */
  setUser: (user: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Ambil user data
   */
  getUser: (): any | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Check apakah user sudah login
   */
  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    return !!token;
  },

  /**
   * Logout - clear semua data
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Clear any other auth-related items
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      sessionStorage.clear();
    }
  },

  /**
   * Redirect ke login page
   */
  redirectToLogin: (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  },

  /**
   * Decode JWT token (tanpa verifikasi)
   */
  decodeToken: (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Check apakah token sudah expired
   */
  isTokenExpired: (token?: string): boolean => {
    const tokenToCheck = token || authUtils.getToken();
    if (!tokenToCheck) return true;

    const decoded = authUtils.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  /**
   * Get token expiry time
   */
  getTokenExpiry: (token?: string): Date | null => {
    const tokenToCheck = token || authUtils.getToken();
    if (!tokenToCheck) return null;

    const decoded = authUtils.decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  },
};