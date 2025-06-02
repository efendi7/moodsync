export const storage = {
  setAuthData: (token: string, user: any) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  },
  
  clearAuthData: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  }
};