'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, CheckCircle, XCircle } from 'lucide-react';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);

    setPasswordStrength({
      minLength: formData.password.length >= 8,
      hasUpperCase: /[A-Z]/.test(formData.password),
      hasLowerCase: /[a-z]/.test(formData.password),
      hasDigit: /\d/.test(formData.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    });
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setMessage('');
    setIsError(false);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Harap lengkapi semua bidang.');
      setIsError(true);
      return;
    }

    if (!passwordMatch) {
      setMessage('Password dan konfirmasi password tidak cocok.');
      setIsError(true);
      return;
    }

    if (!Object.values(passwordStrength).every(Boolean)) {
      setMessage('Password tidak memenuhi kriteria keamanan.');
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      // Ganti dengan URL backend Anda
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response dari backend
        if (data.message) {
          // Jika backend mengirim pesan error spesifik
          setMessage(Array.isArray(data.message) ? data.message.join(', ') : data.message);
        } else {
          setMessage('Terjadi kesalahan saat registrasi.');
        }
        setIsError(true);
      } else {
        // Registrasi berhasil
        setMessage('Registrasi berhasil! Selamat datang di komunitas kami ✨');
        setIsError(false);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        
        
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-3 h-3 text-green-500" />
    ) : (
      <XCircle className="w-3 h-3 text-red-500" />
    );
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 opacity-85"></div>

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
              src="/img/register.svg"
              alt="Ilustrasi Login/Registrasi"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-white text-center max-w-md">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">
              Temukan Keseimbangan Hidup
            </h2>
            <p className="text-purple-200 text-base leading-relaxed">
              Bergabunglah dengan komunitas yang mendukung pertumbuhan personal
              dan kesejahteraan mental Anda
            </p>
          </div>
        </div>

        {/* Side Kanan - Formm Registrasi */}
        <div
          className={`flex-1 max-w-md
                      transition-all duration-700 ease-out transform delay-150
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Mulai Perjalanan
              </h1>
              <p className="text-gray-600 text-sm">Daftarkan diri Anda sekarang</p>
            </div>

            <div className="space-y-4">
              {/* Input Nama */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 text-sm"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

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
                {/* Kompak password strength */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-500 mt-1.5">
                  <div className="flex items-center gap-1">
                    {renderValidationIcon(passwordStrength.minLength)} Min 8 karakter
                  </div>
                  <div className="flex items-center gap-1">
                    {renderValidationIcon(passwordStrength.hasUpperCase)} Huruf kapital
                  </div>
                  <div className="flex items-center gap-1">
                    {renderValidationIcon(passwordStrength.hasLowerCase)} Huruf kecil
                  </div>
                  <div className="flex items-center gap-1">
                    {renderValidationIcon(passwordStrength.hasDigit)} Angka
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    {renderValidationIcon(passwordStrength.hasSpecialChar)} Karakter spesial
                  </div>
                </div>
              </div>

              {/* Input Konfirmasi Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 border-2 ${
                      passwordMatch || formData.confirmPassword === ''
                        ? 'border-purple-200'
                        : 'border-red-400'
                    } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 text-sm`}
                    placeholder="Konfirmasi password Anda"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {!passwordMatch && formData.confirmPassword !== '' && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Password tidak cocok.
                  </p>
                )}
              </div>

              {/* Pesan feedback */}
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

              {/* Tombol Submit */}
              <button
                type="button"
                disabled={loading || !passwordMatch || !Object.values(passwordStrength).every(Boolean)}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Bergabung Sekarang
                  </>
                )}
              </button>
            </div>

            {/* Link ke Login */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Sudah punya akun?
                <a
                  href="/auth/login"
                  className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Masuk di sini
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;