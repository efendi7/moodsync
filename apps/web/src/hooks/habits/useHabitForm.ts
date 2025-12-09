import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { habitsApi ,CreateHabitPayload, FrequencyType,} from '@/services/api/habitsApi';

const CATEGORIES = [
  'health',
  'fitness',
  'productivity',
  'learning',
  'social',
  'mindfulness',
  'finance',
  'other',
];

export const useHabitForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<CreateHabitPayload>({
    name: '',
    description: '',
    category: 'health',
    frequencyType: FrequencyType.DAILY,
    difficultyLevel: 3,
    targetValue: undefined,
    unit: '',
    reminderTime: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof CreateHabitPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Nama habit wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      await habitsApi.createHabit(formData);
      toast.success('Habit berhasil dibuat!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'health',
        frequencyType: FrequencyType.DAILY,
        difficultyLevel: 3,
        targetValue: undefined,
        unit: '',
        reminderTime: '',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Failed to create habit:', error);
      toast.error(error.response?.data?.message || 'Gagal membuat habit');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    isSaving,
    categories: CATEGORIES,
    updateField,
    handleSubmit,
  };
};
