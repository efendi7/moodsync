import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { habitsApi, HabitResponse, HabitStatistics } from '@/services/api/habitsApi';

export const useHabitsData = () => {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [statistics, setStatistics] = useState<HabitStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadHabits = async (filters?: { category?: string; isActive?: boolean }) => {
    try {
      setIsLoading(true);
      const data = await habitsApi.getHabits(filters);
      setHabits(data);
    } catch (error) {
      console.error('Failed to load habits:', error);
      toast.error('Gagal memuat habits');
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async (days: number = 30) => {
    try {
      const stats = await habitsApi.getStatistics(days);
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      toast.error('Gagal memuat statistik');
    }
  };

  useEffect(() => {
    loadHabits();
    loadStatistics();
  }, []);

  return {
    habits,
    statistics,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    loadHabits,
    loadStatistics,
  };
};