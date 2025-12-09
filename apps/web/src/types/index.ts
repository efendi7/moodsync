import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// --- Global User Interface ---
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  streakDays: number;
  totalEntries: number;
  plan: 'free' | 'premium' | 'pro';
  streak?: number;
  wellnessScore?: number;
}

// --- Dashboard Specific ---
export interface Insight {
  id?: string;
  type: 'prediction' | 'recommendation' | 'achievement';
  icon: string | ReactNode;
  title: string;
  description: string;
  action: string;
  confidence?: number; 
  category?: string;
  timestamp?: string;
  
}

export interface QuickAction {
  name: string;
  icon: string | ReactNode;
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
  id?: string;
  name: string;
  completed: boolean;
  streak: number;
  target: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency?: 'daily' | 'weekly';
  completedToday?: boolean;
  progress?: number;
  category?: 'wellness' | 'productivity' | 'health' | 'social';
}

// --- Landing Page ---
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

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  emotions: string[];
  note?: string;
  tags: string[];
  energy: number;
  stress: number;
  anxiety: number;
  happiness: number;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'prediction' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: string;
  timestamp: string;
}

export interface WellnessScore {
  overall: number;
  mood: number;
  habits: number;
  stress: number;
  energy: number;
  trend: 'improving' | 'stable' | 'declining';
}
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}