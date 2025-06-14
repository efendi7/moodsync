// src/types/index.ts (Updated)
import { ReactNode } from 'react';

export interface User {
  name: string;
  avatar: string;
  streak: number;
  wellnessScore: number;
}

export interface Insight {
  type: 'prediction' | 'recommendation' | 'achievement';
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
}

export interface QuickAction {
  name: string;
  icon: ReactNode; // Changed from LucideIcon to ReactNode
  color: string;
  onClick?: () => void;
}

export interface RecentMood {
  date: string;
  mood: string;
  score: number;
  time: string;
}

export interface Habit {
  name: string;
  completed: boolean;
  streak: number;
  target: string;
}

export interface NavItem {
  name: string; // tambahkan ini
  href: string;
  icon?: ReactNode;
  active?: boolean; // tambahkan ini jika dipakai
}
