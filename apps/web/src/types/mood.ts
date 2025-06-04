export interface MoodData {
  index: number;
  emoji: string;
  label: string;
  timestamp: Date;
}

export interface DailyCheckInProps {
  currentMood: number | null;
  setCurrentMood: (mood: number | null) => void;
  isDarkMode: boolean;
  onComplete?: (moodData: MoodData) => void;
  onCameraCapture?: () => void;
  onVoiceRecord?: () => void;
}
