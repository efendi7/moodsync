// src/modules/journal/journal.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, ILike } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { QueryJournalDto } from './dto/query-journal.dto';
import { JournalStatisticsDto } from './dto/journal-response.dto';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepository: Repository<JournalEntry>,
  ) {}

  async create(
    userId: string,
    createDto: CreateJournalDto,
  ): Promise<JournalEntry> {
    const journal = this.journalRepository.create({
      ...createDto,
      userId,
      tags: createDto.tags || [],
      isPrivate: createDto.isPrivate ?? true,
    });

    return await this.journalRepository.save(journal);
  }

  async findAll(userId: string, queryDto: QueryJournalDto) {
    const { page = 1, limit = 10, search, tag, startDate, endDate } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.journalRepository
      .createQueryBuilder('journal')
      .where('journal.userId = :userId', { userId });

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(journal.title LIKE :search OR journal.content LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Tag filter
    if (tag) {
      queryBuilder.andWhere('JSON_CONTAINS(journal.tags, :tag)', {
        tag: JSON.stringify(tag),
      });
    }

    // Date range filter
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'journal.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('journal.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<JournalEntry> {
    const journal = await this.journalRepository.findOne({
      where: { id, userId },
    });

    if (!journal) {
      throw new NotFoundException('Journal entry not found');
    }

    return journal;
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateJournalDto,
  ): Promise<JournalEntry> {
    const journal = await this.findOne(id, userId);

    Object.assign(journal, updateDto);

    return await this.journalRepository.save(journal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const journal = await this.findOne(id, userId);
    await this.journalRepository.remove(journal);
  }

  async getStatistics(
    userId: string,
    days: number = 30,
  ): Promise<JournalStatisticsDto> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const entries = await this.journalRepository
  .createQueryBuilder('je')
  .where('je.userId = :userId', { userId })
  .andWhere('DATE(je.created_at) >= DATE(:dateFrom)', {
    dateFrom: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
  })
  .getMany();

    const totalEntries = entries.length;

    // Entries this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const entriesThisMonth = entries.filter(
      (entry) => new Date(entry.createdAt) >= firstDayOfMonth,
    ).length;

    // Calculate average moods
    const entriesWithMoodBefore = entries.filter((e) => e.moodBefore !== null);
    const entriesWithMoodAfter = entries.filter((e) => e.moodAfter !== null);

    const averageMoodBefore =
      entriesWithMoodBefore.length > 0
        ? entriesWithMoodBefore.reduce((sum, e) => sum + e.moodBefore, 0) /
          entriesWithMoodBefore.length
        : 0;

    const averageMoodAfter =
      entriesWithMoodAfter.length > 0
        ? entriesWithMoodAfter.reduce((sum, e) => sum + e.moodAfter, 0) /
          entriesWithMoodAfter.length
        : 0;

    const moodImprovement = averageMoodAfter - averageMoodBefore;

    // Most used tags
    const tagCounts = new Map<string, number>();
    entries.forEach((entry) => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    const mostUsedTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate streaks
    const allEntries = await this.journalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const { currentStreak, longestStreak } = this.calculateStreaks(allEntries);

    return {
      totalEntries,
      entriesThisMonth,
      averageMoodBefore: Math.round(averageMoodBefore * 10) / 10,
      averageMoodAfter: Math.round(averageMoodAfter * 10) / 10,
      moodImprovement: Math.round(moodImprovement * 10) / 10,
      mostUsedTags,
      longestStreak,
      currentStreak,
    };
  }

  private calculateStreaks(entries: JournalEntry[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (entries.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const dates = entries
      .map((e) => new Date(e.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dates[0] === today || dates[0] === yesterday) {
      currentStreak = 1;

      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        const diffDays = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / 86400000,
        );

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / 86400000,
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  async getRecentEntries(
    userId: string,
    days: number = 7,
  ): Promise<JournalEntry[]> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    return await this.journalRepository.find({
      where: {
        userId,
        createdAt: Between(dateFrom, new Date()),
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }
}
