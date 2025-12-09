import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, subDays, addDays, differenceInDays } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatDateDisplay = (date: Date | string): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

// Custom implementation of eachDayOfInterval for older date-fns versions
const eachDayOfInterval = (interval: { start: Date; end: Date }): Date[] => {
  const { start, end } = interval;
  const days: Date[] = [];
  const totalDays = differenceInDays(end, start);
  
  for (let i = 0; i <= totalDays; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
};

export const getWeekDates = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getLast30Days = () => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  return eachDayOfInterval({ start: thirtyDaysAgo, end: today });
};

export const isToday = (date: Date | string): boolean => {
  return isSameDay(new Date(date), new Date());
};

export const getDayName = (date: Date | string): string => {
  return format(new Date(date), 'EEEE');
};

export const getShortDayName = (date: Date | string): string => {
  return format(new Date(date), 'EEE');
};