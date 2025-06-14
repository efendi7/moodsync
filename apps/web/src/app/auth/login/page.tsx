'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

// Add proper TypeScript interfaces
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
  message?: string;
}

// Interface untuk token Google yang didekode
interface DecodedGoogleToken {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub: string; // Google User ID
  // Tambahkan field lain yang Anda harapkan dari JWT
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  // FIX: Initialize isVisible to true directly to avoid hydration mismatch
  // Animasi "fade-in" akan tetap bekerja karena properti `transition-all`
  // akan diterapkan pada render awal, dan elemen akan langsung muncul.
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  // REMOVED: useEffect yang sebelumnya mengatur isVisible dengan setTimeout.
  // Ini adalah penyebab utama hydration mismatch.
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Updated submit handler using API layer
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { authApi } = await import('@/lib/api/auth');
      const { storage } = await import('@/lib/utils/storage');

      const response = (await authApi.login(formData)) as AuthResponse;

      setMessage('Login berhasil! Selamat datang kembali ✨');
      setIsError(false);
      setFormData({ email: '', password: '' });

      if (response?.access_token) {
        storage.setAuthData(response.access_token, response.user);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error: unknown) {
      let errorMessage = 'Terjadi kesalahan yang tidak terduga';

      if (error instanceof ApiError) {
        errorMessage =
          error.status === 401 ? 'Email atau password salah' : error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk login Google yang sukses
  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const decoded: DecodedGoogleToken = jwtDecode(response.credential);
      console.log('Google Login Success (decoded):', decoded);

      const backendResponse = await fetch('http://localhost:5000/api/v1/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        if (data.message) {
          setMessage(Array.isArray(data.message) ? data.message.join(', ') : data.message);
        } else {
          setMessage('Terjadi kesalahan saat login dengan Google.');
        }
        setIsError(true);
      } else {
        setMessage('Login dengan Google berhasil! Selamat datang ✨');
        setIsError(false);
        // Simpan data autentikasi jika backend Anda mengembalikan token dan info user
        const { access_token, user } = data; // Sesuaikan dengan struktur respons backend Anda
        if (access_token && user) {
          const { storage } = await import('@/lib/utils/storage');
          storage.setAuthData(access_token, user);
        }

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error during Google login processing:', error);
      setMessage('Terjadi kesalahan saat memproses login Google.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk login Google yang gagal
  const handleGoogleFailure = () => {
    console.error('Google Login Failed.');
    setMessage('Login dengan Google gagal. Silakan coba lagi.');
    setIsError(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/img/meditation_person.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 opacity-85"></div>

      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-32 right-32 w-1 h-1 bg-white rounded-full opacity-40"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-30"></div>
        <div className="absolute bottom-1/3 right-20 w-1 h-1 bg-white rounded-full opacity-45"></div>
      </div>

      <div className="flex max-w-6xl w-full items-center justify-between gap-8 relative z-10">
        {/* Left side - Character illustration */}
        <div
          className={`flex-1 flex flex-col items-center justify-center text-center relative
                      transition-all duration-700 ease-out transform
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
        >
          <div className="relative w-[280px] h-[280px] mb-6 flex items-center justify-center overflow-hidden">
            <img
              src="/img/login.svg"
              alt="Ilustrasi Login"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-white text-center max-w-md">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">
              Selamat Datang Kembali
            </h2>
            <p className="text-purple-200 text-base leading-relaxed">
              Lanjutkan perjalanan kesejahteraan mental dan pertumbuhan personal
              Anda bersama kami
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div
          className={`flex-1 max-w-md
                      transition-all duration-700 ease-out transform delay-150
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Masuk</h1>
              <p className="text-gray-600 text-sm">Masuk ke akun Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 text-sm"
                    placeholder="Masukkan email"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 text-sm"
                    placeholder="Masukkan password"
                    required
                    minLength={6} // Pertimbangkan untuk menyesuaikan ini dengan backend Anda
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="/auth/forgot-password"
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Lupa password?
                </a>
              </div>

              {/* Message feedback */}
              {message && (
                <div
                  className={`p-3 rounded-xl text-xs border ${
                    isError
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-green-100 text-green-800 border-green-200'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">ATAU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                text="continue_with" // Atau "signin_with"
                shape="rectangular"
                theme="outline"
                width="100%"
              />
            </div>

            {/* Link to Register */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Belum punya akun?
                <a
                  href="/auth/register"
                  className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Daftar sekarang
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;