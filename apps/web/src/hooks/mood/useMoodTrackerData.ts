import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import moodApi, { MoodEntryResponse } from '@/services/api/moodApi';

export const useMoodTrackerData = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntryResponse[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  const loadMoodEntries = async () => {
    try {
      setIsLoadingEntries(true);
      const entries = await moodApi.getRecentEntries(7);
      setMoodEntries(Array.isArray(entries) ? entries : []);
    } catch (error) {
      console.error('Failed to load mood entries:', error);
      toast.error('Gagal memuat entri mood');
      setMoodEntries([]);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await moodApi.getStatistics(30);
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      toast.error('Gagal memuat statistik');
    }
  };

  useEffect(() => {
    loadMoodEntries();
    loadStatistics();
  }, []);

  return {
    moodEntries,
    statistics,
    isLoadingEntries,
    loadMoodEntries,
    loadStatistics,
    setMoodEntries,
  };
};
