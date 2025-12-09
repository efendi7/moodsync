import { useState } from 'react';
import { toast } from 'react-hot-toast';
import moodApi, { MoodEntryResponse } from '@/services/api/moodApi';
import { MoodTrackerState } from './useMoodTrackerState';

interface UseMoodSaveProps {
  moodState: MoodTrackerState;
  onSuccess: (entry: MoodEntryResponse) => void;
}

export const useMoodSave = ({ moodState, onSuccess }: UseMoodSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveMood = async () => {
    if (!moodState.selectedMood) {
      toast.error('Pilih mood terlebih dahulu');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        mood: moodState.selectedMood,
        intensity: moodState.intensity,
        note: moodState.note || undefined,
        tags: moodState.tags,
        energy: Math.floor(Math.random() * 5) + 1,
        stress: Math.floor(Math.random() * 5) + 1,
        anxiety: Math.floor(Math.random() * 5) + 1,
        happiness: Math.floor(Math.random() * 5) + 1,
      };

      const newEntry = await moodApi.createMoodEntry(payload);
      
      moodState.resetForm();
      onSuccess(newEntry);
      toast.success('Mood berhasil disimpan!');
    } catch (error: any) {
      console.error('Failed to save mood:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan mood');
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveMood };
};