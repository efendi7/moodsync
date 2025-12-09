import React, { useState } from 'react';
import { Calendar, Tag, Edit, Trash2, Lock, Globe } from 'lucide-react';
import { JournalEntryResponse } from '@/services/api/journalApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface JournalListProps {
  entries: JournalEntryResponse[];
  isLoading: boolean;
  isDarkMode: boolean;
  onEdit: (entry: JournalEntryResponse) => void;
  onDelete: (id: string) => void;
}

export const JournalList: React.FC<JournalListProps> = ({
  entries,
  isLoading,
  isDarkMode,
  onEdit,
  onDelete,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cardBg = isDarkMode
    ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700'
    : 'bg-white/70 backdrop-blur-lg border border-gray-200';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={`${cardBg} rounded-2xl p-12 text-center`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Belum ada journal entry. Mulai tulis sekarang!
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Entries Terbaru</h2>
      {entries.map((entry) => {
        const isExpanded = expandedId === entry.id;
        
        return (
          <div
            key={entry.id}
            className={`${cardBg} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {entry.title && (
                    <h3 className="text-xl font-bold">{entry.title}</h3>
                  )}
                  {entry.isPrivate ? (
                    <Lock className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(entry.createdAt)}
                  </div>
                  {entry.moodBefore && entry.moodAfter && (
                    <div className="flex items-center gap-1">
                      <span>Mood: {entry.moodBefore} → {entry.moodAfter}</span>
                      {entry.moodAfter > entry.moodBefore && (
                        <span className="text-green-500">↑</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Yakin ingin menghapus journal ini?')) {
                      onDelete(entry.id);
                    }
                  }}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="whitespace-pre-wrap">
                {isExpanded ? entry.content : truncateText(entry.content)}
              </p>
              {entry.content.length > 150 && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="text-purple-500 hover:text-purple-600 text-sm mt-2 font-medium"
                >
                  {isExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
                </button>
              )}
            </div>

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500" />
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? 'bg-purple-900/30 text-purple-300'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};