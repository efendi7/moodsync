import React from 'react';
import { moodEmojis } from '@/utils/moodUtils';

interface MoodWheelProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  isDarkMode?: boolean;
}

const MoodWheel: React.FC<MoodWheelProps> = ({
  selectedMood,
  onMoodSelect,
  isDarkMode,
}) => {
  const moods = Object.entries(moodEmojis);

  return (
    <div className={`backdrop-blur-lg rounded-2xl p-6 shadow-lg border ${
      isDarkMode
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Bagaimana Perasaanmu?
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {moods.map(([mood, emoji]) => (
          <button
            key={mood}
            onClick={() => onMoodSelect(mood)}
            className={`p-4 rounded-xl transition-all duration-200 ${
              selectedMood === mood
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg scale-105'
                : isDarkMode
                  ? 'bg-gray-700 border-2 border-transparent hover:bg-gray-600 hover:scale-105'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:scale-105'
            }`}
          >
            <div className="text-3xl mb-2">{emoji}</div>
            <div className={`text-xs font-medium capitalize ${
              selectedMood === mood
                ? 'text-gray-700'
                : isDarkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
            }`}>
              {mood}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodWheel;