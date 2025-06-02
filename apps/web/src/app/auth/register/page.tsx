"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import { useRouter } from 'next/navigation';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter(); // ✅ useRouter aktif

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { authApi } = await import("@/lib/api/auth");

      const response = await authApi.register(formData) as RegisterResponse;

      setMessage("Registrasi berhasil! Mengalihkan ke halaman login...");
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        router.push("/auth/login"); // ✅ Navigasi tanpa reload
      }, 1500);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
          <p className="text-gray-600 mt-2">Buat akun baru Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Masukkan email"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Masukkan password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Pesan feedback */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("berhasil")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Daftar
              </>
            )}
          </button>
        </form>

        {/* Link ke Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Sudah punya akun?
            <a
              href="/auth/login"
              className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
