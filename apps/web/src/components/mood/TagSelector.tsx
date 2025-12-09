import React from 'react';
import { MoodTrackerState } from '@/hooks/mood/useMoodTrackerState';

interface TagSelectorProps {
  moodState: MoodTrackerState;
  isDarkMode: boolean;
}

const AVAILABLE_TAGS = [
  'work', 'family', 'exercise', 'social', 
  'health', 'sleep', 'stress', 'achievement'
];

export const TagSelector: React.FC<TagSelectorProps> = ({ moodState, isDarkMode }) => {
  return (
    <div>
      <label 
        className={`block text-sm font-medium mb-3 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        Tag
      </label>

      {/* Preset Tags */}
      <div className="flex flex-wrap gap-3 mb-3">
        {AVAILABLE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => moodState.handleTagToggle(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
              moodState.tags.includes(tag)
                ? 'bg-purple-600 text-white border-purple-600'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 border-transparent hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={moodState.customTag}
          onChange={(e) => moodState.setCustomTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              moodState.handleAddCustomTag();
            }
          }}
          placeholder="Tag kustom (huruf, angka, _)..."
          maxLength={20}
          className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          onClick={moodState.handleAddCustomTag}
          disabled={!moodState.customTag.trim()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            moodState.customTag.trim()
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Tambah
        </button>
      </div>

      {/* Selected Tags Display */}
      {moodState.tags.length > 0 && (
        <div className="mt-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p 
            className={`text-xs mb-2 font-medium ${
              isDarkMode ? 'text-purple-300' : 'text-purple-700'
            }`}
          >
            Tag dipilih ({moodState.tags.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {moodState.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-medium"
              >
                {tag}
                <button
                  onClick={() => moodState.handleTagToggle(tag)}
                  className="hover:text-red-300 ml-1 font-bold text-base leading-none"
                  aria-label={`Hapus tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};