import React from 'react';

interface IntensitySliderProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  isDarkMode?: boolean;
}

const IntensitySlider: React.FC<IntensitySliderProps> = ({
  intensity,
  onIntensityChange,
  isDarkMode
}) => {
  const percentage = ((intensity - 1) / 9) * 100;

  return (
    <div className={`backdrop-blur-lg rounded-2xl p-6 shadow-lg border ${
      isDarkMode
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Intensity Level
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Low</span>
          <span className="text-lg font-bold text-purple-600">{intensity}/10</span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>High</span>
        </div>
        <div className="relative h-8 flex items-center">
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer`}
            style={{
              background: isDarkMode
                ? `linear-gradient(to right, #a855f7, #ec4899 ${percentage}%, #374151 ${percentage}%)` // purple-500, pink-500, gray-700
                : `linear-gradient(to right, #a855f7, #ec4899 ${percentage}%, #e5e7eb ${percentage}%)` // purple-500, pink-500, gray-200
            }}
          />
        </div>
        <div className={`grid grid-cols-10 gap-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="text-center">{i + 1}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntensitySlider;