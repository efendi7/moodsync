import { useState, useEffect, useMemo } from 'react';
import { Heart, Brain, Book, Mic, Award, LucideIcon } from 'lucide-react';
import type { User, Insight, QuickAction, RecentMood, Habit } from '../types';

export const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  heart: Heart,
  award: Award,
  mic: Mic,
  book: Book,
};

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);

  const user: User = useMemo(() => ({
    id: '1',
    name: 'Fendi DiCaprio',
    email: 'fendi@example.com',
    avatar: '👩‍💻',
    joinDate: '2024-01-01',
    streakDays: 12,
    totalEntries: 120,
    plan: 'premium',
    streak: 12,
    wellnessScore: 8.2,
  }), []);

  const todayProgress = 65;

  const insights: Insight[] = useMemo(() => [
    {
      id: '1',
      type: 'prediction',
      icon: 'brain',
      title: 'Energy Peak Predicted',
      description: 'Your energy will peak at 2PM today.',
      action: 'Schedule tasks',
    },
    {
      id: '2',
      type: 'recommendation',
      icon: 'heart',
      title: 'Mindfulness Reminder',
      description: 'Try 10 minutes of meditation.',
      action: 'Start now',
    },
    {
      id: '3',
      type: 'achievement',
      icon: 'award',
      title: 'Habit Streak!',
      description: 'You’ve maintained a 12-day habit streak!',
      action: 'See progress',
    },
  ], []);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      name: 'Log Mood',
      icon: 'heart',
      color: 'from-pink-500 to-red-500',
    },
    {
      name: 'Meditation',
      icon: 'brain',
      color: 'from-purple-500 to-indigo-500',
    },
  ], []);

  const recentMoods: RecentMood[] = useMemo(() => [
    { date: 'Today', mood: '😊', score: 8, time: '2h ago' },
    { date: 'Yesterday', mood: '😌', score: 7, time: '1d ago' },
  ], []);

  const habits: Habit[] = useMemo(() => [
    {
      id: 'h1',
      name: 'Meditate',
      description: 'Morning meditation',
      color: '#A78BFA',
      icon: 'brain',
      target: '10 min',
      frequency: 'daily',
      streak: 12,
      completedToday: true,
      progress: 80,
      category: 'wellness',
      completed: true,
    },
  ], []);

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
export type { User, Insight, QuickAction, RecentMood, Habit };
