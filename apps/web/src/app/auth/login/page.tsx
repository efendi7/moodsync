'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface DecodedGoogleToken {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isVisible] = useState(true); // langsung true, no hydration issue
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // === Login dengan Email & Password ===
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { authApi } = await import('@/lib/api/auth');
      const { storage } = await import('@/lib/utils/storage');

      const response = await authApi.login(formData) as AuthResponse;

      setMessage('Login berhasil! Selamat datang kembali ✨');
      setIsError(false);
      setFormData({ email: '', password: '' });

      if (response?.access_token) {
        storage.setAuthData(response.access_token, response.user);
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (error: unknown) {
      let errorMessage = 'Terjadi kesalahan yang tidak terduga';
      if (error instanceof ApiError) {
        errorMessage = error.status === 401 ? 'Email atau password salah' : error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // === Login dengan Google (Lengkap + Panggil Backend) ===
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const credential = credentialResponse.credential;
      const decoded: DecodedGoogleToken = jwtDecode(credential);

      console.log('Google User:', decoded);

      // Kirim token Google ke backend kamu
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login Google gagal');
      }

      // Simpan token & user dari backend (sama seperti login biasa)
      const { storage } = await import('@/lib/utils/storage');
      storage.setAuthData(data.access_token, data.user);

      setMessage('Login dengan Google berhasil! Selamat datang ✨');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Google login error:', err);
      setMessage(err.message || 'Gagal login dengan Google');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden"
>

      {/* Overlay & dekorasi sama seperti sebelumnya */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 opacity-85"></div>
      {/* ... floating dots ... */}

      <div className="flex max-w-6xl w-full items-center justify-between gap-8 relative z-10">
        {/* Left illustration (sama) */}
        <div className={`flex-1 flex flex-col items-center justify-center text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} transition-all duration-700`}>
          <div className="relative w-[280px] h-[280px] mb-6">
            <img src="/img/login.svg" alt="Ilustrasi Login" className="w-full h-full object-contain" />
          </div>
          <div className="text-white text-center max-w-md">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">
              Selamat Datang Kembali
            </h2>
            <p className="text-purple-200 text-base leading-relaxed">
              Lanjutkan perjalanan kesejahteraan mental dan pertumbuhan personal Anda bersama kami
            </p>
          </div>
        </div>

        {/* Form Login */}
        <div className={`flex-1 max-w-md ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-150`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Masuk</h1>
              <p className="text-gray-600 text-sm">Masuk ke akun Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email & Password fields (sama) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  className="w-full pl-9 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-400 bg-white"
  placeholder="Masukkan email"
  required
/>

                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                 <input
  type={showPassword ? 'text' : 'password'}
  name="password"
  value={formData.password}
  onChange={handleChange}
  className="w-full pl-9 pr-10 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-400 bg-white"
  placeholder="Masukkan password"
  required
/>

                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                    {showPassword ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4 text-purple-400" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="/auth/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-medium">Lupa password?</a>
              </div>

              {message && (
                <div className={`p-3 rounded-xl text-xs border ${isError ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 text-white font-medium py-3 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" /> Masuk</>}
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">ATAU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* GOOGLE LOGIN – SEKARANG BENAR & LENGKAP */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  setMessage('Login dengan Google gagal');
                  setIsError(true);
                }}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                width="350"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Belum punya akun?{' '}
                <a href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">Daftar sekarang</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;