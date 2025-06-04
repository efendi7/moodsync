// src/components/ui/Button.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  gradientFrom?: string;
  gradientTo?: string;
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  gradientFrom,
  gradientTo,
  isDarkMode = true,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
  };

  const variantClasses = {
    primary: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' 
      : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400',
    secondary: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    ghost: isDarkMode
      ? 'bg-transparent hover:bg-gray-800/50 text-gray-300 focus:ring-gray-600'
      : 'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300',
    gradient: gradientFrom && gradientTo
      ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:shadow-lg transform hover:scale-[1.02] text-white focus:ring-purple-400`
      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg transform hover:scale-[1.02] text-white focus:ring-purple-400'
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabledClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};