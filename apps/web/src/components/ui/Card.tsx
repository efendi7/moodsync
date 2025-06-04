import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isDarkMode = true,
  hover = false,
  gradient = false,
}) => {
  const baseClasses = 'rounded-2xl backdrop-blur-sm border transition-all duration-300';
  
  const themeClasses = isDarkMode
    ? gradient
      ? 'bg-gradient-to-br from-gray-800/60 to-purple-900/40 border-gray-700/50'
      : 'bg-gray-800/60 border-gray-700/50'
    : gradient
      ? 'bg-gradient-to-br from-white/80 to-purple-100/60 border-gray-200/50'
      : 'bg-white/80 border-gray-200/50';

  const hoverClasses = hover
    ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
    : '';

  const combinedClasses = `
    ${baseClasses}
    ${themeClasses}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};