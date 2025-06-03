// types/index.ts
export interface User {
  name: string;
  avatar: string;
  streak: number;
  wellnessScore: number;
}

export interface Insight {
  type: "prediction" | "recommendation" | "achievement";
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

export interface QuickAction {
  name: string;
  icon: React.ReactNode;
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

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}
