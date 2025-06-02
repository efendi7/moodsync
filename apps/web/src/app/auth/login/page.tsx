"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";

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

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Updated submit handler using API layer
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { authApi } = await import("@/lib/api/auth");
      const { storage } = await import("@/lib/utils/storage");

      const response = (await authApi.login(formData)) as AuthResponse;

      setMessage("Login berhasil!");
      setFormData({ email: "", password: "" });

      if (response?.access_token) {
        storage.setAuthData(response.access_token, response.user);
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      let errorMessage = "Terjadi kesalahan yang tidak terduga";

      if (error instanceof ApiError) {
        errorMessage =
          error.status === 401 ? "Email atau password salah" : error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

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
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
          <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
        </div>

        <div className="space-y-6">
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            onClick={(e) => handleSubmit(e as any)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Masuk
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Belum punya akun?
            <a
              href="/auth/register"
              className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
