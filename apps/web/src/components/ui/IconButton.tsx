import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isDarkMode?: boolean;
  gradientColors?: string;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  isDarkMode = true,
  gradientColors = 'from-purple-500 to-blue-500',
  tooltip,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantClasses = {
    default: isDarkMode
      ? 'bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white'
      : 'bg-gray-200/60 hover:bg-gray-300 text-gray-600 hover:text-gray-800',
    ghost: isDarkMode
      ? 'bg-transparent hover:bg-gray-700/40 text-gray-400 hover:text-gray-200'
      : 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700',
    gradient: `bg-gradient-to-r ${gradientColors} text-white hover:shadow-lg transform hover:scale-105`
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    rounded-xl backdrop-blur-sm border border-opacity-20 
    transition-all duration-200 cursor-pointer
    flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      title={tooltip}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};
