// src/components/dashboard/DailyCheckIn/MoodSelector.tsx
import React from 'react';

interface MoodSelectorProps {
  moodEmojis: string[];
  moodLabels: string[];
  currentMood: number | null;
  onMoodSelect: (index: number | null) => void;
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
}) => {
  return (
    <div className="mb-6">
      <p className="mb-5 text-center text-lg font-medium">
        How are you feeling today?
      </p>

      {/* RESPONSIF: 4 kolom di HP, 7 kolom di tablet/desktop */}
      <div className="grid grid-cols-4 gap-4 sm:gap-5 md:grid-cols-7">
        {moodEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onMoodSelect(currentMood === index ? null : index)}
            title={moodLabels[index]}
            aria-label={`Select mood: ${moodLabels[index]}`}
            className={`
              relative flex flex-col items-center justify-center
              aspect-square                 /* kotak sempurna */
              rounded-2xl
              transition-all duration-200 transform active:scale-95
              min-w-0 overflow-hidden
              ${currentMood === index ? selectedButtonStyle : unselectedButtonStyle}
            `}
          >
            {/* Emoji — ukuran besar & tetap proporsional */}
            <span className="text-5xl sm:text-5xl md:text-5xl leading-none">
              {emoji}
            </span>

            {/* Label kecil di bawah (hanya muncul di md ke atas biar tidak sesak) */}
            <span className="hidden md:block mt-2 text-xs font-medium opacity-90">
              {moodLabels[index]}
            </span>

            {/* Ring selected */}
            {currentMood === index && (
              <div className="absolute inset-0 rounded-2xl ring-4 ring-purple-400/60 pointer-events-none" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};