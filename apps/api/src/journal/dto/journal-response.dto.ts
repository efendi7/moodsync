export class JournalResponseDto {
  id: string;
  userId: string;
  title?: string;
  content: string;
  moodBefore?: number;
  moodAfter?: number;
  tags: string[];
  isPrivate: boolean;
  aiAnalysis?: any;
  createdAt: Date;
  updatedAt: Date;
}

export class JournalListResponseDto {
  success: boolean;
  data: JournalResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export class JournalStatisticsDto {
  totalEntries: number;
  entriesThisMonth: number;
  averageMoodBefore: number;
  averageMoodAfter: number;
  moodImprovement: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  longestStreak: number;
  currentStreak: number;
}