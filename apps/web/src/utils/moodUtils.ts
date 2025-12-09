export const moodEmojis = {
  'excited': '🤩',
  'happy': '😊',
  'content': '😌',
  'neutral': '😐',
  'sad': '😢',
  'angry': '😠',
  'anxious': '😰',
  'stressed': '😫'
};

export const moodColors = {
  'ecstatic': 'text-yellow-500',
  'happy': 'text-green-500',
  'content': 'text-blue-500',
  'neutral': 'text-gray-500',
  'sad': 'text-blue-600',
  'angry': 'text-red-500',
  'anxious': 'text-orange-500',
  'stressed': 'text-red-600'
};

export const moodBgColors = {
  'ecstatic': 'bg-yellow-100',
  'happy': 'bg-green-100',
  'content': 'bg-blue-100',
  'neutral': 'bg-gray-100',
  'sad': 'bg-blue-100',
  'angry': 'bg-red-100',
  'anxious': 'bg-orange-100',
  'stressed': 'bg-red-100'
};

export const getMoodColor = (mood: string): string => {
  const intensity = Math.random() * 100; // Mock intensity
  if (intensity >= 80) return '#22c55e'; // green
  if (intensity >= 60) return '#3b82f6'; // blue
  if (intensity >= 40) return '#f59e0b'; // yellow
  if (intensity >= 20) return '#ef4444'; // red
  return '#6b7280'; // gray
};

export const calculateWellnessScore = (entries: any[]): number => {
  if (entries.length === 0) return 0;
  
  const recentEntries = entries.slice(-7); // Last 7 days
  const avgMood = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
  const avgEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length;
  const avgStress = recentEntries.reduce((sum, entry) => sum + (10 - entry.stress), 0) / recentEntries.length;
  
  return Math.round((avgMood + avgEnergy + avgStress) / 3);
};