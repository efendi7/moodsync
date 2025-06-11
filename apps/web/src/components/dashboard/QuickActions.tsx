import React from 'react';
import { Card } from '../ui';
import { QuickAction } from '../../types';
import { iconMap } from '../../hooks/useDashboardData'; // import iconMap
import type { LucideIcon } from 'lucide-react';

interface QuickActionsProps {
  actions: QuickAction[];
  isDarkMode: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  isDarkMode,
}) => {
  return (
    <Card isDarkMode={isDarkMode} className="p-6">
      <h3
        className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          // Check if icon exists and is a string before using toLowerCase
          const iconKey =
            action.icon && typeof action.icon === 'string'
              ? action.icon.toLowerCase()
              : '';

          // Get the icon component from iconMap
          const IconComponent: LucideIcon | undefined = iconKey
            ? iconMap[iconKey]
            : undefined;

          return (
            <QuickActionButton
              key={index}
              name={action.name}
              icon={
                IconComponent ? <IconComponent className="w-6 h-6" /> : null
              }
              color={action.color}
              onClick={() => console.log(`${action.name} clicked`)}
            />
          );
        })}
      </div>
    </Card>
  );
};

// Internal component - no export needed
interface QuickActionButtonProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  name,
  icon,
  color,
  onClick,
}) => {
  return (
    <button
      className={`
        group relative overflow-hidden rounded-xl h-16
        bg-gradient-to-r ${color}
        text-white font-medium transition-all duration-300
        hover:shadow-xl hover:shadow-purple-500/25 
        transform hover:scale-[1.02] hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
        flex flex-col items-center justify-center gap-1
        border border-white/20
      `}
      onClick={onClick}
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </div>
        <span className="text-xs font-medium tracking-wide">{name}</span>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
