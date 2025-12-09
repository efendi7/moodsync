import { getLast30Days, formatDate } from '../utils/dateUtils';

const moods = ['happy', 'sad', 'anxious', 'calm', 'excited', 'stressed', 'content', 'frustrated'];
const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'anticipation', 'trust'];
const tags = ['work', 'family', 'exercise', 'sleep', 'social', 'health', 'hobby', 'travel'];

const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateMockMoodData = () => {
  const last30Days = getLast30Days();
  
  return last30Days.map((date: Date, index: number) => {
    const mood = getRandomItem(moods);
    const intensity = Math.floor(Math.random() * 5) + 1;
    const selectedEmotions = getRandomItems(emotions, Math.floor(Math.random() * 3) + 1);
    const selectedTags = getRandomItems(tags, Math.floor(Math.random() * 2) + 1);
    
    return {
      id: `mood-${index}`,
      date: formatDate(date), // Convert Date to string
      mood,
      intensity,
      emotions: selectedEmotions,
      note: Math.random() > 0.5 ? `Note for ${mood} mood on ${formatDate(date)}` : undefined,
      tags: selectedTags,
      energy: Math.floor(Math.random() * 5) + 1,
      stress: Math.floor(Math.random() * 5) + 1,
      anxiety: Math.floor(Math.random() * 5) + 1,
      happiness: Math.floor(Math.random() * 5) + 1,
    };
  });
};