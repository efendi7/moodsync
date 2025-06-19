// src/types/index.ts
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// Interfaces from your existing file:
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
  icon: ReactNode;
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
  name: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

// Interfaces from the previous refactoring step (for the landing page):

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface MoodData {
  date: string;
  mood: string;
  score: number;
  activity: string;
  energy: string;
}

export interface Plan {
  name: string;
  price: string;
  features: string[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}