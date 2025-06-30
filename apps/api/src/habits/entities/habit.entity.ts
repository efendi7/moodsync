import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HabitLog } from './habit-log.entity';

export enum HabitFrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.habits)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'enum', enum: HabitFrequencyType })
  frequency_type: HabitFrequencyType;

  @Column({ type: 'json', nullable: true })
  frequency_value: Record<string, any>;

  @Column({ type: 'tinyint' })
  difficulty_level: number; // 1-5

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  target_value: number;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({ type: 'time', nullable: true, name: 'reminder_time' })
  reminder_time: string; // Format HH:MM:SS

  @Column({ type: 'int', default: 0, name: 'streak_count' })
  streak_count: number;

  @Column({ type: 'int', default: 0, name: 'best_streak' })
  best_streak: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => HabitLog, habitLog => habitLog.habit)
  habitLogs: HabitLog[];
}