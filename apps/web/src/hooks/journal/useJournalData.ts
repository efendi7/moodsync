// apps/web/src/hooks/journal/useJournalData.ts
import { useState, useEffect, useCallback } from 'react';
import { journalApi, JournalEntryResponse, JournalStatistics } from '@/services/api/journalApi';
import { toast } from 'react-hot-toast';

export const useJournalData = () => {
  const [entries, setEntries] = useState<JournalEntryResponse[]>([]);
  const [statistics, setStatistics] = useState<JournalStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryResponse | null>(null);

  const loadEntries = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await journalApi.getJournalEntries(params);
      setEntries(response.data);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast.error('Gagal memuat journal entries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStatistics = useCallback(async (days: number = 30) => {
    try {
      const stats = await journalApi.getStatistics(days);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast.error('Gagal memuat statistik');
    }
  }, []);

  const createEntry = useCallback(async (data: {
    title?: string;
    content: string;
    moodBefore?: number;
    moodAfter?: number;
    tags?: string[];
    isPrivate?: boolean;
  }) => {
    try {
      await journalApi.createJournalEntry(data);
      toast.success('Journal entry berhasil dibuat!');
      await loadEntries();
      await loadStatistics();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating entry:', error);
      toast.error('Gagal membuat journal entry');
      throw error;
    }
  }, [loadEntries, loadStatistics]);

  const updateEntry = useCallback(async (id: string, data: Partial<{
    title?: string;
    content: string;
    moodBefore?: number;
    moodAfter?: number;
    tags?: string[];
    isPrivate?: boolean;
  }>) => {
    try {
      await journalApi.updateJournalEntry(id, data);
      toast.success('Journal entry berhasil diupdate!');
      await loadEntries();
      await loadStatistics();
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Gagal mengupdate journal entry');
      throw error;
    }
  }, [loadEntries, loadStatistics]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await journalApi.deleteJournalEntry(id);
      toast.success('Journal entry berhasil dihapus!');
      await loadEntries();
      await loadStatistics();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Gagal menghapus journal entry');
      throw error;
    }
  }, [loadEntries, loadStatistics]);

  useEffect(() => {
    loadEntries();
    loadStatistics();
  }, [loadEntries, loadStatistics]);

  return {
    entries,
    statistics,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    selectedEntry,
    setSelectedEntry,
    loadEntries,
    loadStatistics,
    createEntry,
    updateEntry,
    deleteEntry,
  };
};