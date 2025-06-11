// hooks/useDashboardData.ts
import { useState, useEffect, useMemo } from 'react';
import { Heart, Brain, Book, Mic, Award, LucideIcon } from 'lucide-react';

// Types
export interface User {
  name: string;
  avatar: string;
  streak: number;
  wellnessScore: number;
}

export interface Insight {
  type: 'prediction' | 'recommendation' | 'achievement';
  icon: string; // Changed from iconType to icon
  title: string;
  description: string;
  action: string;
}

export interface QuickAction {
  name: string;
  icon: string; // Changed from iconType to icon
  color: string;
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

// Icon mapping - keep this for internal use
export const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  heart: Heart,
  award: Award,
  mic: Mic,
  book: Book,
};

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const user: User = useMemo(() => ({
    name: 'Fendi DiCaprio',
    avatar: '👩‍💻',
    streak: 12,
    wellnessScore: 8.2,
  }), []);

  const todayProgress = 65;

  const insights: Insight[] = useMemo(() => [
    {
      type: 'prediction',
      icon: 'Brain', // Changed to match Lucide icon name
      title: 'Energy Peak Predicted',
      description: 'Based on your patterns, your energy will peak around 2 PM today',
      action: 'Schedule important tasks',
    },
    {
      type: 'recommendation', 
      icon: 'Heart', // Changed to match Lucide icon name
      title: 'Mindfulness Recommended',
      description: "You've been stressed lately. Try 10 minutes of meditation",
      action: 'Start session',
    },
    {
      type: 'achievement',
      icon: 'Award', // Changed to match Lucide icon name
      title: 'Habit Streak Achievement',
      description: '12 days of consistent morning routine! Keep it up',
      action: 'View habits',
    },
  ], []);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      name: 'Log Mood',
      icon: 'Heart', // Changed to match Lucide icon name
      color: 'from-pink-500 to-red-500',
    },
    {
      name: 'Meditation',
      icon: 'Brain', // Changed to match Lucide icon name
      color: 'from-purple-500 to-indigo-500',
    },
    {
      name: 'Voice Note',
      icon: 'Mic', // Changed to match Lucide icon name
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Journal',
      icon: 'Book', // Changed to match Lucide icon name
      color: 'from-green-500 to-emerald-500',
    },
  ], []);

  const recentMoods: RecentMood[] = useMemo(() => [
    { date: 'Today', mood: '😊', score: 8, time: '2 hours ago' },
    { date: 'Yesterday', mood: '😌', score: 7, time: 'Yesterday' },
    { date: 'Thu', mood: '😊', score: 9, time: '2 days ago' },
    { date: 'Wed', mood: '😐', score: 6, time: '3 days ago' },
    { date: 'Tue', mood: '😔', score: 4, time: '4 days ago' },
  ], []);

  const habits: Habit[] = useMemo(() => [
    {
      name: 'Morning Meditation',
      completed: true,
      streak: 12,
      target: '10 min',
    },
    {
      name: 'Exercise',
      completed: true,
      streak: 8,
      target: '30 min'
    },
    {
      name: 'Gratitude Journal',
      completed: false,
      streak: 5,
      target: '3 items',
    },
    {
      name: 'Water Intake',
      completed: true,
      streak: 15,
      target: '8 glasses'
    },
  ], []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    todayProgress,
    insights,
    quickActions,
    recentMoods,
    habits,
    isLoading,
  };
};