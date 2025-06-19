// src/lib/data.ts
import { ReactNode } from 'react';
import { Brain, BarChart3, Heart, Users } from 'lucide-react';
import { Feature, MoodData, Plan } from '@/types';

export const useCases: string[] = [
  'Personal Wellness',
  'Remote Work',
  'Student Life',
  'Corporate Teams',
  'Therapy Support',
];

export const features: Feature[] = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Smart mood analysis with personalized recommendations',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Discover patterns and correlations in your wellness journey',
  },
  {
    icon: Heart,
    title: 'Mindfulness Tools',
    description: 'Guided meditations, breathing exercises, and sleep stories',
  },
  {
    icon: Users,
    title: 'Social Support',
    description: 'Connect with support circles and wellness professionals',
  },
];

export const moodData: MoodData[] = [
  {
    date: 'Mon',
    mood: '😊',
    score: 8,
    activity: 'Morning meditation',
    energy: 'High',
  },
  {
    date: 'Tue',
    mood: '😐',
    score: 6,
    activity: 'Work stress',
    energy: 'Medium',
  },
  {
    date: 'Wed',
    mood: '😊',
    score: 9,
    activity: 'Exercise + journaling',
    energy: 'High',
  },
  {
    date: 'Thu',
    mood: '😔',
    score: 4,
    activity: 'Poor sleep',
    energy: 'Low',
  },
  {
    date: 'Fri',
    mood: '😊',
    score: 8,
    activity: 'Social time',
    energy: 'High',
  },
];

export const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Basic mood tracking',
      'Limited AI insights',
      'Community access',
      'Basic analytics',
    ],
  },
  {
    name: 'Premium',
    price: '$9.99',
    features: [
      'Advanced AI insights',
      'Unlimited tracking',
      'Premium content',
      'Predictive analytics',
      'Priority support',
    ],
  },
  {
    name: 'Pro',
    price: '$29.99',
    features: [
      'All Premium features',
      'Client management',
      'Professional tools',
      'Assessment builder',
      'Crisis detection',
    ],
  },
];