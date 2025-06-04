import { useCallback } from 'react';
import { MoodData } from '../types/mood';
import { MOOD_EMOJIS, MOOD_LABELS } from '../constants/mood';

interface UseMoodSelectionProps {
  currentMood: number | null;
  setCurrentMood: (mood: number | null) => void;
  onComplete?: (moodData: MoodData) => void;
}

export const useMoodSelection = ({
  currentMood,
  setCurrentMood,
  onComplete,
}: UseMoodSelectionProps) => {
  const handleMoodSelect = useCallback((moodIndex: number) => {
    setCurrentMood(moodIndex);
  }, [setCurrentMood]);

  const handleComplete = useCallback(() => {
    if (currentMood !== null && onComplete) {
      const moodData: MoodData = {
        index: currentMood,
        emoji: MOOD_EMOJIS[currentMood],
        label: MOOD_LABELS[currentMood],
        timestamp: new Date(),
      };
      onComplete(moodData);
    }
  }, [currentMood, onComplete]);

  return {
    handleMoodSelect,
    handleComplete,
  };
};