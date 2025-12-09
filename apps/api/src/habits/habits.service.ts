import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { HabitLog } from './entities/habit-log.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { LogHabitDto } from './dto/log-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitsRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private habitLogsRepository: Repository<HabitLog>,
  ) {}

  async create(userId: string, createHabitDto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitsRepository.create({
      ...createHabitDto,
      userId,
      streakCount: 0,
      bestStreak: 0,
      isActive: true,
    });

    return await this.habitsRepository.save(habit);
  }

  async findAll(
    userId: string,
    filters?: {
      category?: string;
      isActive?: boolean;
    },
  ): Promise<Habit[]> {
    const query = this.habitsRepository
      .createQueryBuilder('habit')
      .where('habit.userId = :userId', { userId })
      .orderBy('habit.createdAt', 'DESC');

    if (filters?.category) {
      query.andWhere('habit.category = :category', { category: filters.category });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('habit.isActive = :isActive', { isActive: filters.isActive });
    }

    return await query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({
      where: { id, userId },
      relations: ['logs'],
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
  }

  async update(
    id: string,
    userId: string,
    updateHabitDto: UpdateHabitDto,
  ): Promise<Habit> {
    const habit = await this.findOne(id, userId);

    Object.assign(habit, updateHabitDto);

    return await this.habitsRepository.save(habit);
  }

  async remove(id: string, userId: string): Promise<void> {
    const habit = await this.findOne(id, userId);
    await this.habitsRepository.remove(habit);
  }

  // ──────────────── HABIT LOGS ────────────────

  async logHabit(
    habitId: string,
    userId: string,
    logHabitDto: LogHabitDto,
  ): Promise<HabitLog> {
    const habit = await this.findOne(habitId, userId);

    // Check if log already exists for this date
    const existingLog = await this.habitLogsRepository.findOne({
      where: {
        habitId,
        userId,
        date: logHabitDto.date,
      },
    });

    if (existingLog) {
      throw new BadRequestException('Log already exists for this date');
    }

    const log = this.habitLogsRepository.create({
      ...logHabitDto,
      habitId,
      userId,
    });

    const savedLog = await this.habitLogsRepository.save(log);

    // Update streak
    await this.updateStreak(habitId, userId);

    return savedLog;
  }

  async updateLog(
    logId: string,
    userId: string,
    logHabitDto: Partial<LogHabitDto>,
  ): Promise<HabitLog> {
    const log = await this.habitLogsRepository.findOne({
      where: { id: logId, userId },
    });

    if (!log) {
      throw new NotFoundException('Log not found');
    }

    Object.assign(log, logHabitDto);
    const updatedLog = await this.habitLogsRepository.save(log);

    // Update streak
    await this.updateStreak(log.habitId, userId);

    return updatedLog;
  }

  async deleteLog(logId: string, userId: string): Promise<void> {
    const log = await this.habitLogsRepository.findOne({
      where: { id: logId, userId },
    });

    if (!log) {
      throw new NotFoundException('Log not found');
    }

    const habitId = log.habitId;
    await this.habitLogsRepository.remove(log);

    // Update streak
    await this.updateStreak(habitId, userId);
  }

  async getHabitLogs(
    habitId: string,
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HabitLog[]> {
    await this.findOne(habitId, userId);

    const query = this.habitLogsRepository
      .createQueryBuilder('log')
      .where('log.habitId = :habitId', { habitId })
      .andWhere('log.userId = :userId', { userId })
      .orderBy('log.date', 'DESC');

    if (startDate && endDate) {
      query.andWhere('log.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return await query.getMany();
  }

  // ──────────────── STATISTICS ────────────────

  async getStatistics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const habits = await this.findAll(userId, { isActive: true });
    
    const logs = await this.habitLogsRepository
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId })
      .andWhere('log.date >= :startDate', { startDate: startDateStr })
      .getMany();

    const completedLogs = logs.filter(log => log.completed);
    const totalLogs = logs.length;
    const completionRate = totalLogs > 0 ? (completedLogs.length / totalLogs) * 100 : 0;

    // Calculate streak stats
    const currentStreaks = habits.map(h => h.streakCount);
    const bestStreaks = habits.map(h => h.bestStreak);

    // Category breakdown
    const categoryStats = habits.reduce((acc, habit) => {
      if (!acc[habit.category]) {
        acc[habit.category] = { total: 0, completed: 0 };
      }
      const habitLogs = logs.filter(l => l.habitId === habit.id);
      const habitCompleted = habitLogs.filter(l => l.completed);
      acc[habit.category].total += habitLogs.length;
      acc[habit.category].completed += habitCompleted.length;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return {
      totalHabits: habits.length,
      activeHabits: habits.filter(h => h.isActive).length,
      totalLogs,
      completedLogs: completedLogs.length,
      completionRate: Math.round(completionRate),
      averageStreak: currentStreaks.length > 0 
        ? Math.round(currentStreaks.reduce((a, b) => a + b, 0) / currentStreaks.length)
        : 0,
      bestStreak: Math.max(...bestStreaks, 0),
      categoryBreakdown: Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        total: stats.total,
        completed: stats.completed,
        rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      })),
    };
  }

  // ──────────────── STREAK CALCULATION ────────────────

  private async updateStreak(habitId: string, userId: string): Promise<void> {
    const habit = await this.habitsRepository.findOne({
      where: { id: habitId, userId },
    });

    if (!habit) return;

    const logs = await this.habitLogsRepository
      .createQueryBuilder('log')
      .where('log.habitId = :habitId', { habitId })
      .andWhere('log.userId = :userId', { userId })
      .andWhere('log.completed = :completed', { completed: true })
      .orderBy('log.date', 'DESC')
      .getMany();

    if (logs.length === 0) {
      habit.streakCount = 0;
      await this.habitsRepository.save(habit);
      return;
    }

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < logs.length; i++) {
      const logDate = new Date(logs[i].date);
      logDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    habit.streakCount = streak;
    if (streak > habit.bestStreak) {
      habit.bestStreak = streak;
    }

    await this.habitsRepository.save(habit);
  }
}