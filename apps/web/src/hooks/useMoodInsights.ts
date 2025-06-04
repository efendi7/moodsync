import { useMemo } from 'react';
import { MOOD_INSIGHTS } from '../constants/mood';

export const useMoodInsights = (moodIndex: number | null) => {
  return useMemo(() => {
    if (moodIndex === null) return null;
    return MOOD_INSIGHTS[moodIndex] || "Keep tracking your mood for better insights.";
  }, [moodIndex]);
};