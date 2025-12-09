import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface MoodTrackerState {
  selectedMood: string;
  intensity: number;
  note: string;
  tags: string[];
  customTag: string;
  setSelectedMood: (mood: string) => void;
  setIntensity: (intensity: number) => void;
  setNote: (note: string) => void;
  setCustomTag: (tag: string) => void;
  handleTagToggle: (tag: string) => void;
  handleAddCustomTag: () => void;
  resetForm: () => void;
}

const TAG_VALIDATION = {
  MAX_LENGTH: 20,
  PATTERN: /^[a-z0-9_]+$/,
};

export const useMoodTrackerState = (): MoodTrackerState => {
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const handleTagToggle = useCallback((tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleAddCustomTag = useCallback(() => {
    const trimmed = customTag.trim().toLowerCase();

    if (!trimmed) {
      toast.error('Tag tidak boleh kosong');
      return;
    }

    if (tags.includes(trimmed)) {
      toast.error('Tag sudah dipilih');
      return;
    }

    if (trimmed.length > TAG_VALIDATION.MAX_LENGTH) {
      toast.error(`Tag maksimal ${TAG_VALIDATION.MAX_LENGTH} karakter`);
      return;
    }

    if (!TAG_VALIDATION.PATTERN.test(trimmed)) {
      toast.error('Tag hanya boleh huruf, angka, dan underscore');
      return;
    }

    setTags((prev) => [...prev, trimmed]);
    setCustomTag('');
    toast.success(`Tag "${trimmed}" ditambahkan`);
  }, [customTag, tags]);

  const resetForm = useCallback(() => {
    setSelectedMood('');
    setIntensity(5);
    setNote('');
    setTags([]);
    setCustomTag('');
  }, []);

  return {
    selectedMood,
    intensity,
    note,
    tags,
    customTag,
    setSelectedMood,
    setIntensity,
    setNote,
    setCustomTag,
    handleTagToggle,
    handleAddCustomTag,
    resetForm,
  };
};
