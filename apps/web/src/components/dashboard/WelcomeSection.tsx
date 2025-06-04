import React from 'react';

interface WelcomeSectionProps {
  userName: string;
  isDarkMode: boolean;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName, isDarkMode }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Good Night, {userName.split(" ")[0]} 👋
      </h1>
      <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Ready to make today amazing? Let's check in with your wellness.
      </p>
    </div>
  );
};