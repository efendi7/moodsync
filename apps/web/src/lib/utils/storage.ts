// @/lib/utils/storage.ts → GANTI JADI INI:
export const storage = {
  setAuthData: (token: string, user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);     // ← sesuai yang kamu cek
      localStorage.setItem('user', JSON.stringify(user)); // ← sesuai yang kamu cek
    }
  },

  getAuthData: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },

  clearAuthData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },
};