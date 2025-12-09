import React from 'react';
import { X, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useHabitForm } from '@/hooks/habits/useHabitForm';
import { FrequencyType } from '@/services/api/habitsApi';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: () => void;
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  const { formData, isSaving, categories, updateField, handleSubmit } = useHabitForm(() => {
    onSuccess();
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Buat Habit Baru</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Nama Habit */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Habit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Contoh: Olahraga pagi 30 menit"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Deskripsi optional..."
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Category & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Frekuensi</label>
              <select
                value={formData.frequencyType}
                onChange={(e) => updateField('frequencyType', e.target.value as FrequencyType)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value={FrequencyType.DAILY}>Harian</option>
                <option value={FrequencyType.WEEKLY}>Mingguan</option>
                <option value={FrequencyType.CUSTOM}>Custom</option>
              </select>
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Tingkat Kesulitan: {formData.difficultyLevel}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.difficultyLevel}
              onChange={(e) => updateField('difficultyLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span>Mudah</span>
              <span>Sedang</span>
              <span>Sulit</span>
            </div>
          </div>

          {/* Target & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target (optional)</label>
              <input
                type="number"
                value={formData.targetValue || ''}
                onChange={(e) => updateField('targetValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="30"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Satuan</label>
              <input
                type="text"
                value={formData.unit || ''}
                onChange={(e) => updateField('unit', e.target.value)}
                placeholder="menit, halaman, gelas"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Waktu Reminder (optional)</label>
            <input
              type="time"
              value={formData.reminderTime || ''}
              onChange={(e) => updateField('reminderTime', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !formData.name.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Habit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
