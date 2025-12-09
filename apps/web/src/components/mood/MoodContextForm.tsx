import React from 'react';
import { Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MoodTrackerState } from '@/hooks/mood/useMoodTrackerState';
import { useMoodSave } from '@/hooks/mood/useMoodSave';
import { TagSelector } from './TagSelector';

interface MoodContextFormProps {
  moodState: MoodTrackerState;
  isDarkMode: boolean;
  onSaveSuccess: () => void;
}

export const MoodContextForm: React.FC<MoodContextFormProps> = ({ 
  moodState, 
  isDarkMode, 
  onSaveSuccess 
}) => {
  const { isSaving, saveMood } = useMoodSave({
    moodState,
    onSuccess: onSaveSuccess,
  });

  return (
    <div
      className={`backdrop-blur-lg rounded-2xl p-8 shadow-lg border ${
        isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}
    >
      <h3 className="text-xl font-semibold mb-6">Tambah Konteks</h3>

      <div className="space-y-5">
        <div>
          <label 
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Ada yang mau dicatat?
          </label>
          <textarea
            value={moodState.note}
            onChange={(e) => moodState.setNote(e.target.value)}
            placeholder="Catatan opsional..."
            rows={4}
            className={`w-full p-4 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <TagSelector moodState={moodState} isDarkMode={isDarkMode} />

        <button
          onClick={saveMood}
          disabled={!moodState.selectedMood || isSaving}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            moodState.selectedMood && !isSaving
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <>
              <LoadingSpinner size="small" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan Mood
            </>
          )}
        </button>
      </div>
    </div>
  );
};