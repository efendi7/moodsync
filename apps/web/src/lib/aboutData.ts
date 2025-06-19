// src/lib/aboutData.ts
import { TeamMember } from '@/types';
import { Zap, Heart, Shield, LucideIcon } from 'lucide-react';

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Muhammad Ma'mun Efendi",
    role: "Founder & Lead Developer",
    image: "/img/Efendi.png", // Ganti dengan path gambar profil Anda di public/img
    bio: "Halo! Saya Ma'mun Efendi, pencipta di balik MoodSync. Berasal dari Kabupaten Demak, Provinsi Jawa Tengah dan lulusan Universitas Negeri Semarang, saya memulai MoodSync dengan satu tujuan: memanfaatkan kecerdasan buatan untuk membuat perawatan kesehatan mental lebih mudah diakses dan dipahami oleh semua orang. Saya percaya teknologi dapat menjadi jembatan menuju kesejahteraan emosional yang lebih baik.",
    socials: {
      linkedin: "https://www.linkedin.com/in/muhammad-mamun-efendi-1725511b0/", // Ganti dengan profil LinkedIn Anda
      github: "https://github.com/mamunefendi", // Ganti dengan profil GitHub Anda
      // twitter: "https://twitter.com/your-mamun-twitter", // Hapus atau tambahkan jika ada
    },
  },
];

export interface ValueItem {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

export const ourValues: ValueItem[] = [
  {
    icon: Zap,
    iconColor: "text-purple-500",
    title: 'Inovasi',
    description: 'Terus mendorong batas dengan AI untuk memberikan solusi kesejahteraan yang inovatif.',
  },
  {
    icon: Heart,
    iconColor: "text-pink-500",
    title: 'Empati',
    description: 'Membangun platform yang memahami dan benar-benar peduli terhadap kesejahteraan pengguna kami.',
  },
  {
    icon: Shield,
    iconColor: "text-blue-500",
    title: 'Integritas',
    description: 'Menegakkan standar tertinggi privasi, keamanan, dan praktik AI yang etis.',
  },
];