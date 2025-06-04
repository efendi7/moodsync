import React from 'react';

interface MoodSelectorProps {
  moodEmojis: string[];
  moodLabels: string[];
  currentMood: number | null;
  onMoodSelect: (index: number | null) => void; // null juga bisa
  selectedButtonStyle: string;
  unselectedButtonStyle: string;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  moodEmojis,
  moodLabels,
  currentMood,
  onMoodSelect,
  selectedButtonStyle,
  unselectedButtonStyle,
}) => (
  <div className="mb-6">
    <p className="mb-4 text-lg">How are you feeling today?</p>
    <div className="flex items-center justify-between gap-2">
      {moodEmojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onMoodSelect(currentMood === index ? null : index)}
          title={moodLabels[index]}
          className={`text-3xl p-3 rounded-xl transition-all ${
            currentMood === index ? selectedButtonStyle : unselectedButtonStyle
          }`}
          aria-label={`Select mood: ${moodLabels[index]}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
);
