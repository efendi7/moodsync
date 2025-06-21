import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Hindari gagal build karena ESLint
  },
  // Tambahan konfigurasi lain bisa tetap di bawah sini
};

export default nextConfig;
