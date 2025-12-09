import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import {
  CreateMoodEntryDto,
  UpdateMoodEntryDto,
  QueryMoodEntriesDto,
  MoodEntryResponseDto,
} from './dto';

@Injectable()
export class MoodEntryService {
  constructor(
    @InjectRepository(MoodEntry)
    private readonly moodEntryRepository: Repository<MoodEntry>,
  ) {}

  /**
   * Create a new mood entry for the authenticated user
   */
  async create(
    userId: string,
    createMoodEntryDto: CreateMoodEntryDto,
  ): Promise<MoodEntryResponseDto> {
    const moodEntry = this.moodEntryRepository.create({
      userId,
      moodScore: this.mapMoodToScore(createMoodEntryDto.mood),
      energyLevel: createMoodEntryDto.energy,
      anxietyLevel: createMoodEntryDto.anxiety,
      stressLevel: createMoodEntryDto.stress,
      happinessLevel: createMoodEntryDto.happiness,
      moodEmotions: createMoodEntryDto.emotions || [],
      moodIntensity: createMoodEntryDto.intensity,
      contextTags: createMoodEntryDto.tags || [],
      location: createMoodEntryDto.location,
      weatherCondition: createMoodEntryDto.weatherCondition,
      notes: createMoodEntryDto.note,
      recordedAt: createMoodEntryDto.recordedAt
        ? new Date(createMoodEntryDto.recordedAt)
        : new Date(),
    });

    const saved = await this.moodEntryRepository.save(moodEntry);
    return this.mapToResponseDto(saved, createMoodEntryDto.mood);
  }

  /**
   * Get all mood entries for a user with optional filtering
   */
  async findAll(
    userId: string,
    query: QueryMoodEntriesDto,
  ): Promise<{ success: true; data: MoodEntryResponseDto[]; total: number; page: number; limit: number }> {
    const { startDate, endDate, page = 1, limit = 10 } = query;

    const whereCondition: any = { userId };

    if (startDate && endDate) {
      whereCondition.recordedAt = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      whereCondition.recordedAt = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      whereCondition.recordedAt = LessThanOrEqual(new Date(endDate));
    }

    const [entries, total] = await this.moodEntryRepository.findAndCount({
      where: whereCondition,
      order: { recordedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: entries.map(entry => this.mapToResponseDto(entry)),
      total,
      page,
      limit,
    };
  }

  async findOne(userId: string, id: string): Promise<MoodEntryResponseDto> {
    const entry = await this.moodEntryRepository.findOne({
      where: { id, userId },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID ${id} not found`);
    }

    return this.mapToResponseDto(entry);
  }

  /**
   * Update a mood entry
   */
  async update(
    userId: string,
    id: string,
    updateMoodEntryDto: UpdateMoodEntryDto,
  ): Promise<MoodEntryResponseDto> {
    const entry = await this.moodEntryRepository.findOne({
      where: { id, userId },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID ${id} not found`);
    }

    // Update fields if provided
    if (updateMoodEntryDto.mood) {
      entry.moodScore = this.mapMoodToScore(updateMoodEntryDto.mood);
    }
    if (updateMoodEntryDto.intensity !== undefined) {
      entry.moodIntensity = updateMoodEntryDto.intensity;
    }
    if (updateMoodEntryDto.energy !== undefined) {
      entry.energyLevel = updateMoodEntryDto.energy;
    }
    if (updateMoodEntryDto.stress !== undefined) {
      entry.stressLevel = updateMoodEntryDto.stress;
    }
    if (updateMoodEntryDto.anxiety !== undefined) {
      entry.anxietyLevel = updateMoodEntryDto.anxiety;
    }
    if (updateMoodEntryDto.happiness !== undefined) {
      entry.happinessLevel = updateMoodEntryDto.happiness;
    }
    if (updateMoodEntryDto.emotions) {
      entry.moodEmotions = updateMoodEntryDto.emotions;
    }
    if (updateMoodEntryDto.note !== undefined) {
      entry.notes = updateMoodEntryDto.note;
    }
    if (updateMoodEntryDto.tags) {
      entry.contextTags = updateMoodEntryDto.tags;
    }
    if (updateMoodEntryDto.location !== undefined) {
      entry.location = updateMoodEntryDto.location;
    }
    if (updateMoodEntryDto.weatherCondition !== undefined) {
      entry.weatherCondition = updateMoodEntryDto.weatherCondition;
    }
    if (updateMoodEntryDto.recordedAt) {
      entry.recordedAt = new Date(updateMoodEntryDto.recordedAt);
    }

    const updated = await this.moodEntryRepository.save(entry);
    return this.mapToResponseDto(updated, updateMoodEntryDto.mood);
  }

  /**
   * Delete a mood entry
   */
  async remove(userId: string, id: string): Promise<void> {
    const entry = await this.moodEntryRepository.findOne({
      where: { id, userId },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID ${id} not found`);
    }

    await this.moodEntryRepository.remove(entry);
  }

  /**
   * Get recent entries (last N days)
   * ✅ FIXED: Menggunakan recordedAt, bukan createdAt
   */
  async getRecentEntries(
    userId: string,
    days: number = 7,
  ): Promise<{ success: true; data: MoodEntryResponseDto[] }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0); // Set ke awal hari

    const entries = await this.moodEntryRepository.find({
      where: {
        userId,
        recordedAt: MoreThanOrEqual(startDate), // ✅ FIXED: Pakai recordedAt
      },
      order: { recordedAt: 'DESC' }, // ✅ FIXED: Sort by recordedAt
      take: 50, // Limit maksimal 50 entries
    });

    return {
      success: true,
      data: entries.map(entry =>
        this.mapToResponseDto(entry, this.mapScoreToMood(entry.moodScore)),
      ),
    };
  }

  /**
   * Get mood statistics for the last N days
   * ✅ FIXED: Menggunakan recordedAt untuk filter
   */
  async getStatistics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const entries = await this.moodEntryRepository.find({
      where: {
        userId,
        recordedAt: MoreThanOrEqual(startDate), // ✅ FIXED: Pakai recordedAt
      },
    });

    if (entries.length === 0) {
      return {
        success: true,
        data: {
          totalEntries: 0,
          averageMood: 0,
          averageEnergy: 0,
          averageStress: 0,
          averageAnxiety: 0,
          averageHappiness: 0,
          mostCommonTags: [],
        },
      };
    }

    const count = entries.length;

    const sum = entries.reduce(
      (acc, e) => ({
        mood: acc.mood + (e.moodScore ?? 0),
        energy: acc.energy + (e.energyLevel ?? 0),
        stress: acc.stress + (e.stressLevel ?? 0),
        anxiety: acc.anxiety + (e.anxietyLevel ?? 0),
        happiness: acc.happiness + (e.happinessLevel ?? 0),
      }),
      { mood: 0, energy: 0, stress: 0, anxiety: 0, happiness: 0 },
    );

    const safeAvg = (val: number) =>
      val > 0 ? Number((val / count).toFixed(2)) : 0;

    const tagCounts = new Map<string, number>();

    entries.forEach(e => {
      const tags = Array.isArray(e.contextTags) ? e.contextTags : [];
      tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const mostCommonTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return {
      success: true,
      data: {
        totalEntries: count,
        averageMood: safeAvg(sum.mood),
        averageEnergy: safeAvg(sum.energy),
        averageStress: safeAvg(sum.stress),
        averageAnxiety: safeAvg(sum.anxiety),
        averageHappiness: safeAvg(sum.happiness),
        mostCommonTags,
      },
    };
  }

  /**
   * Helper: Map mood string to numeric score
   */
  private mapMoodToScore(mood: string): number {
    const moodMap: Record<string, number> = {
      happy: 5,
      excited: 5,
      joyful: 5,
      content: 4,
      calm: 4,
      neutral: 3,
      sad: 2,
      anxious: 2,
      stressed: 2,
      angry: 1,
      depressed: 1,
    };

    return moodMap[mood.toLowerCase()] || 3;
  }

  /**
   * Helper: Map score back to mood string
   */
  private mapScoreToMood(score: number): string {
    if (score >= 5) return 'happy';
    if (score >= 4) return 'content';
    if (score >= 3) return 'neutral';
    if (score >= 2) return 'sad';
    return 'stressed';
  }

  /**
   * Helper: Map entity to response DTO
   */
  private mapToResponseDto(
    entry: MoodEntry,
    moodOverride?: string,
  ): MoodEntryResponseDto {
    return {
      id: entry.id,
      date: entry.recordedAt.toISOString(),
      mood: moodOverride || this.mapScoreToMood(entry.moodScore),
      intensity: entry.moodIntensity || 5,
      emotions: entry.moodEmotions || [],
      note: entry.notes,
      tags: entry.contextTags || [],
      energy: entry.energyLevel || 0,
      stress: entry.stressLevel || 0,
      anxiety: entry.anxietyLevel || 0,
      happiness: entry.happinessLevel || 0,
      location: entry.location,
      weatherCondition: entry.weatherCondition,
      recordedAt: entry.recordedAt,
      createdAt: entry.createdAt,
    };
  }
}