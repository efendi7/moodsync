import React, { useMemo } from 'react';
import { DailyCheckInProps } from '../../../types/mood';
import { MOOD_EMOJIS, MOOD_LABELS } from '../../../constants/mood';
import { useMoodInsights } from '../../../hooks/useMoodInsights';
import { useMoodSelection } from '../../../hooks/useMoodSelection';
import { getDailyCheckInStyles } from '../../../utils/styleUtils';
import { Header } from './Header';
import { MoodSelector } from './MoodSelector';
import { MoodInsight } from './MoodInsight';
import { ActionButtons } from './ActionButtons';

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  currentMood,
  setCurrentMood,
  isDarkMode,
  onComplete,
  onCameraCapture,
  onVoiceRecord,
}) => {
  const styles = useMemo(() => getDailyCheckInStyles(isDarkMode), [isDarkMode]);
  const insight = useMoodInsights(currentMood);
  const { handleMoodSelect, handleComplete } = useMoodSelection({
    currentMood,
    setCurrentMood,
    onComplete,
  });

  return (
    <div className={styles.container}>
      <Header />
      
      <MoodSelector
        moodEmojis={MOOD_EMOJIS}
        moodLabels={MOOD_LABELS}
        currentMood={currentMood}
        onMoodSelect={handleMoodSelect}
        selectedButtonStyle={styles.selectedMoodButton}
        unselectedButtonStyle={styles.unselectedMoodButton}
      />

      {currentMood !== null && insight && (
        <MoodInsight
          selectedMood={MOOD_EMOJIS[currentMood]}
          insight={insight}
          textStyle={styles.moodText}
          insightTextStyle={styles.insightText}
        />
      )}

      <ActionButtons
        onComplete={handleComplete}
        onCamera={onCameraCapture}
        onVoice={onVoiceRecord}
        iconButtonStyle={styles.iconButton}
        isCompleteDisabled={currentMood === null}
      />
    </div>
  );
};