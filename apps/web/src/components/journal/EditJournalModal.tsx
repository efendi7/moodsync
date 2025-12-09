// apps/web/src/components/journal/EditJournalModal.tsx
import React, { useState, useEffect } from 'react';
import { X, BookOpen, Tag as TagIcon, Lock, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { JournalEntryResponse } from '@/services/api/journalApi';

interface EditJournalModalProps {
  isOpen: boolean;
  entry: JournalEntryResponse;
  onClose: () => void;
  isDarkMode: boolean;
  onSuccess: (id: string, data: any) => Promise<void>;
}

export const EditJournalModal: React.FC<EditJournalModalProps> = ({
  isOpen,
  entry,
  onClose,
  isDarkMode,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodBefore, setMoodBefore] = useState<number | undefined>();
  const [moodAfter, setMoodAfter] = useState<number | undefined>();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content);
      setMoodBefore(entry.moodBefore);
      setMoodAfter(entry.moodAfter);
      setTags(entry.tags || []);
      setIsPrivate(entry.isPrivate);
    }
  }, [entry]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Konten journal tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess(entry.id, {
        title: title.trim() || undefined,
        content: content.trim(),
        moodBefore,
        moodAfter,
        tags,
        isPrivate,
      });
    } catch (error) {
      // Error handling already in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${modalBg} ${textColor} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Edit Journal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Judul (Opsional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Berikan judul untuk journal-mu..."
              className={`w-full px-4 py-3 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textColor}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Konten Journal *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis pikiran dan perasaanmu di sini..."
              rows={10}
              className={`w-full px-4 py-3 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${textColor}`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mood Sebelum (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={moodBefore || ''}
                onChange={(e) => setMoodBefore(e.target.value ? parseInt(e.target.value) : undefined)}
                className={`w-full px-4 py-3 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textColor}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mood Sesudah (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={moodAfter || ''}
                onChange={(e) => setMoodAfter(e.target.value ? parseInt(e.target.value) : undefined)}
                className={`w-full px-4 py-3 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textColor}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Tambah tag..."
                className={`flex-1 px-4 py-2 ${inputBg} border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${textColor}`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Privacy</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  isPrivate
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Lock className="w-5 h-5" />
                Private
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  !isPrivate
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Globe className="w-5 h-5" />
                Public
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Menyimpan...' : 'Update Journal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};