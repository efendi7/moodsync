import React from 'react';
import { iconMap } from '../hooks/useDashboardData';

interface IconRendererProps {
  iconType: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  iconType,
  className = 'w-5 h-5',
}) => {
  const IconComponent = iconMap[iconType];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} />;
};
