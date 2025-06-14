'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Play,
  ArrowRight,
  Check,
  Brain,
  Heart,
  BarChart3,
  Users,
  Moon,
  Sun,
  Zap,
  Shield,
  Smartphone,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

const MoodSyncLandingPage = () => {
  const [activeUseCase, setActiveUseCase] = useState('Personal Wellness');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const useCases = [
    'Personal Wellness',
    'Remote Work',
    'Student Life',
    'Corporate Teams',
    'Therapy Support',
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Insights',
      description: 'Smart mood analysis with personalized recommendations',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description:
        'Discover patterns and correlations in your wellness journey',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Mindfulness Tools',
      description: 'Guided meditations, breathing exercises, and sleep stories',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Social Support',
      description: 'Connect with support circles and wellness professionals',
    },
  ];

  const moodData = [
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

  const plans = [
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode
    ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900';

  return (
    <div className={themeClasses}>
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? 'bg-gray-900/90 backdrop-blur-xl border-b border-gray-700'
              : 'bg-white/90 backdrop-blur-xl border-b border-gray-200'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MoodSync
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Features
            </a>
            <a
              href="#pricing"
              className={`${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              Pricing
            </a>
            <a
              href="#about"
              className={`${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              About
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              } transition-colors`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              href="/auth/login"
              className={`${
                isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors cursor-pointer font-medium`}
            >
              Log in
            </Link>

            <Link
              href="/auth/register"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 ${
              isDarkMode
                ? 'bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}
          >
            Your AI-Powered
            <br />
            Mental Wellness Journey
          </h1>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Track your mood, build healthy habits, and get personalized insights
            powered by AI to optimize your mental wellness and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
            <button
              className={`border px-8 py-4 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? 'border-gray-600 hover:border-gray-400 text-white'
                  : 'border-gray-300 hover:border-gray-500 text-gray-900'
              }`}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div
            className={`${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
            } backdrop-blur-sm rounded-2xl border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } overflow-hidden shadow-2xl`}
          >
            <div
              className={`${
                isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'
              } px-6 py-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } flex items-center gap-4`}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                MoodSync Dashboard
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead
                  className={isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}
                >
                  <tr
                    className={`border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <th
                      className={`text-left p-4 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Mood
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Score
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Activity
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Energy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {moodData.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        isDarkMode
                          ? 'border-gray-800 hover:bg-gray-800/30'
                          : 'border-gray-100 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="p-4 font-medium">{row.date}</td>
                      <td className="p-4 text-2xl">{row.mood}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            row.score >= 8
                              ? 'bg-green-500/20 text-green-400'
                              : row.score >= 6
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {row.score}/10
                        </span>
                      </td>
                      <td
                        className={`p-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {row.activity}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            row.energy === 'High'
                              ? 'bg-purple-500/20 text-purple-300'
                              : row.energy === 'Medium'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {row.energy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Perfect for Every Wellness Journey
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {useCases.map((useCase, index) => (
                <div key={index} className="group">
                  <button
                    onClick={() => setActiveUseCase(useCase)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      activeUseCase === useCase
                        ? isDarkMode
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-purple-400 bg-purple-50'
                        : isDarkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{useCase}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        activeUseCase === useCase ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeUseCase === useCase && (
                    <div
                      className={`mt-4 p-4 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-white/70 border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold mb-2">
                        AI-Powered Personal Wellness
                      </h4>
                      <p
                        className={`text-sm mb-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Track your daily moods, build healthy habits, and
                        receive personalized insights to optimize your mental
                        health and productivity.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Check className="w-4 h-4" />
                        Improve wellness by 60% in first month
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              className={`${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
              } rounded-2xl border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <div className="space-y-4">
                {moodData.slice(0, 3).map((row, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    } rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{row.mood}</span>
                      <div>
                        <div className="font-medium">{row.date}</div>
                        <div
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {row.activity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{row.score}/10</div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {row.energy} Energy
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Mental Health
            <br />
            Companion That Learns
          </h2>
          <p
            className={`text-xl mb-16 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Powered by advanced AI to provide personalized insights and support
            for your wellness journey
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div
                  className={`${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
                  } rounded-2xl border ${
                    isDarkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  } p-8 h-full transition-all duration-300`}
                >
                  <div
                    className={`bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            How MoodSync Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Track Your Mood',
                desc: 'Quick daily check-ins with our intuitive mood wheel and context tagging',
                icon: <Heart className="w-8 h-8" />,
              },
              {
                step: '02',
                title: 'AI Analyzes Patterns',
                desc: 'Our AI identifies triggers, trends, and correlations in your wellness data',
                icon: <Brain className="w-8 h-8" />,
              },
              {
                step: '03',
                title: 'Get Personalized Insights',
                desc: 'Receive actionable recommendations to improve your mental wellness',
                icon: <Zap className="w-8 h-8" />,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div
                  className={`${
                    isDarkMode
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                      : 'bg-gradient-to-br from-white to-gray-50'
                  } rounded-2xl border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } p-8 h-full`}
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 w-fit mx-auto mb-4">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div
                    className={`text-3xl font-bold mb-4 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {item.desc}
                  </p>
                </div>
                {index < 2 && (
                  <ArrowRight
                    className={`hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Wellness Plan
          </h2>
          <p
            className={`text-xl mb-16 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Start free and upgrade as your wellness journey grows
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
                } rounded-2xl border ${
                  index === 1
                    ? 'border-purple-500 relative'
                    : isDarkMode
                      ? 'border-gray-700'
                      : 'border-gray-200'
                } p-8 ${index === 1 ? 'scale-105' : ''}`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span
                    className={`text-lg font-normal ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span
                        className={
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    index === 1
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : isDarkMode
                        ? 'border border-gray-600 hover:border-gray-400'
                        : 'border border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {index === 0 ? 'Start Free' : 'Start Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform
            <br />
            Your Mental Wellness?
          </h2>
          <p
            className={`text-xl mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Join thousands who've improved their mental health with AI-powered
            insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5" />
              Start Free Trial
            </button>
            <button
              className={`border px-8 py-4 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? 'border-gray-600 hover:border-gray-400'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              Schedule Demo
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              14-day Free Trial
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        } px-6 py-12`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoodSync
              </div>
            </div>
            <div
              className={`flex items-center space-x-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <a
                href="#"
                className={`${
                  isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
                } transition-colors`}
              >
                Privacy
              </a>
              <a
                href="#"
                className={`${
                  isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
                } transition-colors`}
              >
                Terms
              </a>
              <a
                href="#"
                className={`${
                  isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'
                } transition-colors`}
              >
                Support
              </a>
            </div>
          </div>
          <div
            className={`mt-8 pt-8 border-t ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            } text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            <p>
              &copy; 2025 MoodSync - AI-Powered Mental Wellness Platform. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MoodSyncLandingPage;
