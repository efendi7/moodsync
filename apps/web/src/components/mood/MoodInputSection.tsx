import React from 'react';
import MoodWheel from '@/components/mood/MoodWheel';
import IntensitySlider from '@/components/mood/IntensitySlider';
import { MoodContextForm } from './MoodContextForm';
import { MoodTrackerState } from '@/hooks/mood/useMoodTrackerState';

interface MoodInputSectionProps {
  moodState: MoodTrackerState;
  isDarkMode: boolean;
  onSaveSuccess: () => void;
}

export const MoodInputSection: React.FC<MoodInputSectionProps> = ({ 
  moodState, 
  isDarkMode, 
  onSaveSuccess 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div className="space-y-8">
        <MoodWheel
          selectedMood={moodState.selectedMood}
          onMoodSelect={moodState.setSelectedMood}
          isDarkMode={isDarkMode}
        />
        <IntensitySlider
          intensity={moodState.intensity}
          onIntensityChange={moodState.setIntensity}
          isDarkMode={isDarkMode}
        />
      </div>

      <MoodContextForm
        moodState={moodState}
        isDarkMode={isDarkMode}
        onSaveSuccess={onSaveSuccess}
      />
    </div>
  );
};