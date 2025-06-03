// src/components/layouts/Sidebar.tsx

import React from "react";
import {
  BarChart3,
  Calendar,
  Settings,
  Heart,
  Brain,
  Book,
  Target,
  TrendingUp,
  Users,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { NavItem } from "../../types";

interface SidebarProps {
  isDarkMode: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isDarkMode,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigationItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "#",
      active: true,
    },
    {
      name: "Mood Tracker",
      icon: <Heart className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Habits",
      icon: <Target className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Journal",
      icon: <Book className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Analytics",
      icon: <TrendingUp className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Meditation",
      icon: <Brain className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Calendar",
      icon: <Calendar className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Community",
      icon: <Users className="w-5 h-5" />,
      href: "#",
    },
  ];

  const bottomItems: NavItem[] = [
    {
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Help & Support",
      icon: <HelpCircle className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "#",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${
        isDarkMode
          ? "bg-gray-900/95 backdrop-blur-xl border-r border-gray-700"
          : "bg-white/95 backdrop-blur-xl border-r border-gray-200"
      }`}
    >
      {/* Sidebar Header - Set explicit h-16 and keep border-b */}
      <div
        className={`relative flex items-center h-16 px-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {/* Only show MoodSync branding if not collapsed */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 absolute left-4">
            {" "}
            {/* Added absolute and left-4 for positioning */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MoodSync
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors z-10 ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="mx-2 w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation - Adjust height to fill remaining space */}
      <div className="flex flex-col h-[calc(100%-4rem)]">
        {" "}
        {/* 4rem = h-16 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                  item.active
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400"
                    : isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {/* Text only visible if not collapsed, add a transition for smoothness */}
                <span
                  className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {item.name}
                </span>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div
                    className={`absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </a>
            ))}
          </div>
        </nav>
        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2">
            {bottomItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {/* Text only visible if not collapsed, add a transition for smoothness */}
                <span
                  className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </a>
            ))}

            {/* Logout button */}
            <button
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {/* Logout text only visible if not collapsed, add a transition for smoothness */}
              <span
                className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
