// src/app/dashboard/page.tsx (or wherever your dashboard component is located)

"use client";

import React, { useState } from "react";
import { Heart, Brain, Book, Mic, Award } from "lucide-react";
import { Header } from "../layouts/Header";
import { WelcomeSection } from "../../components/dashboard/WelcomeSection";
import { StatsCards } from "../../components/dashboard/StatsCards";
import { DailyCheckIn } from "../../components/dashboard/DailyCheckin";
import { AIInsights } from "../../components/dashboard/AIInsight";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { RecentMoods } from "../../components/dashboard/RecentMoods";
import { HabitsProgress } from "../../components/dashboard/HabitsProgress";
import { User, Insight, QuickAction, RecentMood, Habit } from "../../types";
import { Sidebar } from "..//layouts/Sidebar";

const MoodSyncDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [todayProgress] = useState(65);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar

  const user: User = {
    name: "Fendi DiCaprio",
    avatar: "👩‍💻",
    streak: 12,
    wellnessScore: 8.2,
  };

  const todayInsights: Insight[] = [
    {
      type: "prediction",
      icon: <Brain className="w-5 h-5" />,
      title: "Energy Peak Predicted",
      description:
        "Based on your patterns, your energy will peak around 2 PM today",
      action: "Schedule important tasks",
    },
    {
      type: "recommendation",
      icon: <Heart className="w-5 h-5" />,
      title: "Mindfulness Recommended",
      description: "You've been stressed lately. Try 10 minutes of meditation",
      action: "Start session",
    },
    {
      type: "achievement",
      icon: <Award className="w-5 h-5" />,
      title: "Habit Streak Achievement",
      description: "12 days of consistent morning routine! Keep it up",
      action: "View habits",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      name: "Log Mood",
      icon: <Heart className="w-5 h-5" />,
      color: "from-pink-500 to-red-500",
    },
    {
      name: "Meditation",
      icon: <Brain className="w-5 h-5" />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Voice Note",
      icon: <Mic className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Journal",
      icon: <Book className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const recentMoods: RecentMood[] = [
    { date: "Today", mood: "😊", score: 8, time: "2 hours ago" },
    { date: "Yesterday", mood: "😌", score: 7, time: "Yesterday" },
    { date: "Thu", mood: "😊", score: 9, time: "2 days ago" },
    { date: "Wed", mood: "😐", score: 6, time: "3 days ago" },
    { date: "Tue", mood: "😔", score: 4, time: "4 days ago" },
  ];

  const habits: Habit[] = [
    {
      name: "Morning Meditation",
      completed: true,
      streak: 12,
      target: "10 min",
    },
    { name: "Exercise", completed: true, streak: 8, target: "30 min" },
    {
      name: "Gratitude Journal",
      completed: false,
      streak: 5,
      target: "3 items",
    },
    { name: "Water Intake", completed: true, streak: 15, target: "8 glasses" },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900";

  return (
    <div className={themeClasses}>
      {/* Sidebar */}
      <Sidebar
        isDarkMode={isDarkMode}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main content area, whose left margin is adjusted by sidebar state */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Header
          user={user}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          // REMOVE THIS LINE: isSidebarCollapsed={isSidebarCollapsed}
        />

        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <WelcomeSection userName={user.name} isDarkMode={isDarkMode} />

          <StatsCards
            user={user}
            todayProgress={todayProgress}
            isDarkMode={isDarkMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DailyCheckIn
                currentMood={currentMood}
                setCurrentMood={setCurrentMood}
                isDarkMode={isDarkMode}
              />

              <AIInsights insights={todayInsights} isDarkMode={isDarkMode} />
            </div>

            <div className="space-y-8">
              <QuickActions actions={quickActions} isDarkMode={isDarkMode} />
              <RecentMoods moods={recentMoods} isDarkMode={isDarkMode} />
              <HabitsProgress habits={habits} isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodSyncDashboard;