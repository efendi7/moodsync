"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
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
  PanelLeftOpen,
  PanelLeftClose,
  ChevronLeft,
} from "lucide-react";

import { NavItem } from "../../types";
import { useSidebar } from "@/app/hooks/useSidebar";

interface SidebarProps {
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const router = useRouter();
  const pathname = usePathname(); // <-- UNTUK DETEKSI MENU AKTIF
  const { isCollapsed, isOpen, toggleCollapsed, close } = useSidebar();

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "sidebar-scrollbar-style";
    style.textContent = `
      .sidebar-scroll::-webkit-scrollbar { width: 6px; }
      .sidebar-scroll::-webkit-scrollbar-track { 
        background: ${isDarkMode ? "#1f2937" : "#f3f4f6"}; 
        border-radius: 3px; 
      }
      .sidebar-scroll::-webkit-scrollbar-thumb { 
        background: ${isDarkMode ? "#4b5563" : "#9ca3af"}; 
        border-radius: 3px; 
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [isDarkMode]);

  const navigationItems: NavItem[] = [
    { name: "Dashboard", icon: <BarChart3 className="w-5 h-5" />, href: "/dashboard" },
    { name: "Mood Tracker", icon: <Heart className="w-5 h-5" />, href: "/mood-tracker" },
    { name: "Habits", icon: <Target className="w-5 h-5" />, href: "/habits" },
    { name: "Journal", icon: <Book className="w-5 h-5" />, href: "/journal" },
    { name: "Analytics", icon: <TrendingUp className="w-5 h-5" />, href: "#" },
    { name: "Meditation", icon: <Brain className="w-5 h-5" />, href: "#" },
    { name: "Calendar", icon: <Calendar className="w-5 h-5" />, href: "#" },
    { name: "Community", icon: <Users className="w-5 h-5" />, href: "#" },
  ];

  const bottomItems: NavItem[] = [
    { name: "Notifications", icon: <Bell className="w-5 h-5" />, href: "#" },
    { name: "Help & Support", icon: <HelpCircle className="w-5 h-5" />, href: "#" },
    { name: "Settings", icon: <Settings className="w-5 h-5" />, href: "#" },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  };

  const isExpanded = !isCollapsed || isOpen;
  const sidebarWidth = isExpanded ? "w-64" : "w-20";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 h-full
          ${sidebarWidth}
          transition-all duration-300 ease-in-out
          ${isDarkMode
            ? "bg-gray-900/95 backdrop-blur-xl border-r border-gray-700"
            : "bg-white/95 backdrop-blur-xl border-r border-gray-200"
          }
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div
          className={`relative flex items-center justify-between h-16 px-5 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {isExpanded && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoodSync
              </span>
            </div>
          )}

          <button
            onClick={isOpen ? close : toggleCollapsed}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="sidebar-scroll flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href); // <-- AUTO ACTIVE

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-medium"
                        : isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="flex-shrink-0">{item.icon}</div>

                  <span
                    className={`font-medium transition-all duration-300 ${
                      isExpanded ? "opacity-100" : "w-0 opacity-0"
                    } overflow-hidden whitespace-nowrap`}
                  >
                    {item.name}
                  </span>

                  {isCollapsed && !isOpen && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </a>
              );
            })}
          </nav>

          <div
            className={`p-4 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } space-y-1`}
          >
            {bottomItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span
                  className={`font-medium transition-all duration-300 ${
                    isExpanded ? "opacity-100" : "w-0 opacity-0"
                  } overflow-hidden whitespace-nowrap`}
                >
                  {item.name}
                </span>
              </a>
            ))}

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isDarkMode
                  ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span
                className={`font-medium transition-all duration-300 ${
                  isExpanded ? "opacity-100" : "w-0 opacity-0"
                } overflow-hidden whitespace-nowrap`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
