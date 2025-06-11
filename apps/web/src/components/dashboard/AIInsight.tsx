import React from 'react';
import { Card, Button, Badge } from '../ui';
import { iconMap } from '../../hooks/useDashboardData';
import { Insight } from '../../types';

interface AIInsightsProps {
  insights: Insight[];
  isDarkMode: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  insights,
  isDarkMode,
}) => {
  const getInsightBadgeVariant = (type: string) => {
    switch (type) {
      case 'prediction':
        return 'info';
      case 'recommendation':
        return 'warning';
      case 'achievement':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card isDarkMode={isDarkMode} gradient className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          AI Insights
        </h3>
        <Badge variant="info" size="sm">
          3 new insights
        </Badge>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} isDarkMode={isDarkMode} hover className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                {(() => {
                  if (typeof insight.icon === 'string') {
                    const IconComponent = iconMap[insight.icon.toLowerCase()];
                    return IconComponent ? (
                      <IconComponent className="w-5 h-5 text-purple-600" />
                    ) : null;
                  }

                  return null; // Jika bukan string, jangan render apapun
                })()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {insight.title}
                  </h4>
                  <Badge
                    variant={getInsightBadgeVariant(insight.type)}
                    size="sm"
                  >
                    {insight.type}
                  </Badge>
                </div>

                <p
                  className={`text-sm mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {insight.description}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-white hover:bg-purple-500 transition-colors"
                >
                  {insight.action}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
