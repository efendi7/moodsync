"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Brain,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  User,
  ChevronRight,
  TrendingUp,
  Zap,
  Moon,
  Sun,
  Play,
  Book,
  Target,
  Clock,
  Award,
  Users,
  MessageCircle,
  Camera,
  Mic,
  PlusCircle,
  CheckCircle,
  Activity,
  Sparkles,
} from "lucide-react";

const MoodSyncDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [todayProgress, setTodayProgress] = useState(65);

  // Mock data
  const user = {
    name: "Fendi DiCaprio",
    avatar: "👩‍💻",
    streak: 12,
    wellnessScore: 8.2,
  };

  const todayInsights = [
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

  const quickActions = [
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

  const recentMoods = [
    { date: "Today", mood: "😊", score: 8, time: "2 hours ago" },
    { date: "Yesterday", mood: "😌", score: 7, time: "Yesterday" },
    { date: "Thu", mood: "😊", score: 9, time: "2 days ago" },
    { date: "Wed", mood: "😐", score: 6, time: "3 days ago" },
    { date: "Tue", mood: "😔", score: 4, time: "4 days ago" },
  ];

  const habits = [
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

  const moodEmojis = ["😢", "😔", "😐", "🙂", "😊", "😄", "🤩"];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode
    ? "min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900";

  return (
    <div className={themeClasses}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${
          isDarkMode
            ? "bg-gray-900/90 backdrop-blur-xl border-b border-gray-700"
            : "bg-white/90 backdrop-blur-xl border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MoodSync
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="flex items-center gap-2 text-purple-400 font-medium"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </a>
            <a
              href="#"
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Mood Tracker
            </a>
            <a
              href="#"
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Habits
            </a>
            <a
              href="#"
              className={`${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              Analytics
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{user.avatar}</div>
              <div className="hidden md:block">
                <div className="font-medium">{user.name}</div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user.streak} day streak
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Good morning, {user.name.split(" ")[0]} 👋
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Ready to make today amazing? Let's check in with your wellness.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/70"
            } backdrop-blur-sm rounded-2xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-2xl font-bold ${
                  user.wellnessScore >= 8
                    ? "text-green-400"
                    : user.wellnessScore >= 6
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {user.wellnessScore}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Wellness Score</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Great improvement!
            </p>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/70"
            } backdrop-blur-sm rounded-2xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {user.streak}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Day Streak</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Personal record!
            </p>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/70"
            } backdrop-blur-sm rounded-2xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {todayProgress}%
              </span>
            </div>
            <h3 className="font-semibold mb-1">Today's Progress</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              3 of 4 habits done
            </p>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/70"
            } backdrop-blur-sm rounded-2xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-400">High</span>
            </div>
            <h3 className="font-semibold mb-1">Energy Level</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Peak at 2 PM
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Check-in */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-white/70"
              } backdrop-blur-sm rounded-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Daily Check-in
              </h2>

              <div className="mb-6">
                <p className="mb-4 text-lg">How are you feeling today?</p>
                <div className="flex items-center justify-between gap-2">
                  {moodEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMood(index)}
                      className={`text-3xl p-3 rounded-xl transition-all ${
                        currentMood === index
                          ? isDarkMode
                            ? "bg-purple-500/20 scale-110"
                            : "bg-purple-100 scale-110"
                          : isDarkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {currentMood !== null && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    You selected:{" "}
                    <span className="text-2xl ml-2">
                      {moodEmojis[currentMood]}
                    </span>
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    AI Insight: This mood pattern suggests good energy levels
                    today. Consider tackling challenging tasks!
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                  Complete Check-in
                </button>
                <button
                  className={`px-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "border-gray-600 hover:border-gray-400"
                      : "border-gray-300 hover:border-gray-500"
                  } transition-colors`}
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  className={`px-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "border-gray-600 hover:border-gray-400"
                      : "border-gray-300 hover:border-gray-500"
                  } transition-colors`}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Today's Insights */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-white/70"
              } backdrop-blur-sm rounded-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-400" />
                Today's AI Insights
              </h2>

              <div className="space-y-4">
                {todayInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      isDarkMode
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:border-gray-300"
                    } transition-colors group cursor-pointer`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          insight.type === "prediction"
                            ? "bg-blue-500/20 text-blue-400"
                            : insight.type === "recommendation"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{insight.title}</h3>
                        <p
                          className={`text-sm mb-3 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {insight.description}
                        </p>
                        <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-white/70"
              } backdrop-blur-sm rounded-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-xl border ${
                      isDarkMode
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:border-gray-300"
                    } transition-all group hover:scale-105`}
                  >
                    <div
                      className={`bg-gradient-to-r ${action.color} rounded-lg p-3 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <div className="text-white">{action.icon}</div>
                    </div>
                    <p className="font-medium text-sm">{action.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Moods */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-white/70"
              } backdrop-blur-sm rounded-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-6">Recent Moods</h2>
              <div className="space-y-3">
                {recentMoods.map((mood, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mood.mood}</span>
                      <div>
                        <div className="font-medium text-sm">{mood.date}</div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {mood.time}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        mood.score >= 8
                          ? "bg-green-500/20 text-green-400"
                          : mood.score >= 6
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {mood.score}/10
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium">
                View All Moods →
              </button>
            </div>

            {/* Habit Progress */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800/50" : "bg-white/70"
              } backdrop-blur-sm rounded-2xl border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } p-6`}
            >
              <h2 className="text-xl font-bold mb-6">Today's Habits</h2>
              <div className="space-y-4">
                {habits.map((habit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          habit.completed
                            ? "bg-green-500 border-green-500"
                            : isDarkMode
                            ? "border-gray-600"
                            : "border-gray-300"
                        }`}
                      >
                        {habit.completed && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <div>
                        <div
                          className={`font-medium text-sm ${
                            habit.completed ? "line-through opacity-75" : ""
                          }`}
                        >
                          {habit.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {habit.streak} day streak • {habit.target}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium">
                View All Habits →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodSyncDashboard;
