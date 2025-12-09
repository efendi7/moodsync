import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HabitResponse } from '@/services/api/habitsApi';
import { habitsApi } from '@/services/api/habitsApi';
import { toast } from 'react-hot-toast';

interface LogHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: HabitResponse;
  isDarkMode: boolean;
  onSuccess: () => void;
}

export const LogHabitModal: React.FC<LogHabitModalProps> = ({
  isOpen,
  onClose,
  habit,
  isDarkMode,
  onSuccess,
}) => {
  const [logData, setLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    completed: true,
    valueAchieved: habit.targetValue || undefined,
    notes: '',
    moodBefore: undefined as number | undefined,
    moodAfter: undefined as number | undefined,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await habitsApi.logHabit(habit.id, logData);
      toast.success('Log berhasil disimpan!');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Log sudah ada untuk tanggal ini');
      } else {
        toast.error('Gagal menyimpan log');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold">{habit.name}</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Catat pencapaianmu hari ini
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Tanggal</label>
            <input
              type="date"
              value={logData.date}
              onChange={(e) => setLogData({ ...logData, date: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Completed */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={logData.completed}
              onChange={(e) => setLogData({ ...logData, completed: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <label className="text-sm font-medium">Selesai dikerjakan</label>
          </div>

          {/* Value Achieved */}
          {habit.targetValue && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Nilai Tercapai ({habit.unit})
              </label>
              <input
                type="number"
                value={logData.valueAchieved || ''}
                onChange={(e) =>
                  setLogData({
                    ...logData,
                    valueAchieved: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Catatan</label>
            <textarea
              value={logData.notes}
              onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
              rows={3}
              placeholder="Bagaimana rasanya?"
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Mood Before/After */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mood Sebelum</label>
              <input
                type="number"
                min="1"
                max="5"
                value={logData.moodBefore || ''}
                onChange={(e) =>
                  setLogData({
                    ...logData,
                    moodBefore: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="1-5"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mood Sesudah</label>
              <input
                type="number"
                min="1"
                max="5"
                value={logData.moodAfter || ''}
                onChange={(e) =>
                  setLogData({
                    ...logData,
                    moodAfter: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="1-5"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Log
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};