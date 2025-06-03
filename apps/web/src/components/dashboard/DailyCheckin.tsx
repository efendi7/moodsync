
import React from 'react';
import { Sparkles, Camera, Mic } from 'lucide-react';

interface DailyCheckInProps {
  currentMood: number | null;
  setCurrentMood: (mood: number | null) => void;
  isDarkMode: boolean;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  currentMood,
  setCurrentMood,
  isDarkMode,
}) => {
  const moodEmojis = ["😢", "😔", "😐", "🙂", "😊", "😄", "🤩"];

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800/50" : "bg-white/70"
      } backdrop-blur-sm rounded-2xl border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } p-6`}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-purple-400" />
        Daily Check-in
      </h2>

      <div className="mb-6">
        <p className="mb-4 text-lg">How are you feeling today?</p>
        <div className="flex items-center justify-between gap-2">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => setCurrentMood(index)}
              className={`text-3xl p-3 rounded-xl transition-all ${
                currentMood === index
                  ? isDarkMode
                    ? "bg-purple-500/20 scale-110"
                    : "bg-purple-100 scale-110"
                  : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {currentMood !== null && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            You selected:{" "}
            <span className="text-2xl ml-2">{moodEmojis[currentMood]}</span>
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            AI Insight: This mood pattern suggests good energy levels today. Consider tackling challenging tasks!
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
          Complete Check-in
        </button>
        <button
          className={`px-4 py-3 rounded-xl border ${
            isDarkMode
              ? "border-gray-600 hover:border-gray-400"
              : "border-gray-300 hover:border-gray-500"
          } transition-colors`}
        >
          <Camera className="w-5 h-5" />
        </button>
        <button
          className={`px-4 py-3 rounded-xl border ${
            isDarkMode
              ? "border-gray-600 hover:border-gray-400"
              : "border-gray-300 hover:border-gray-500"
          } transition-colors`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};