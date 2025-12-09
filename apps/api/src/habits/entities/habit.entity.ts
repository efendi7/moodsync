import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HabitLog } from './habit-log.entity';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({
    name: 'frequency_type',
    type: 'enum',
    enum: ['daily', 'weekly', 'custom'],
  })
  frequencyType: string;

  @Column({ name: 'frequency_value', type: 'json', nullable: true })
  frequencyValue: any;

  @Column({ name: 'difficulty_level', type: 'tinyint' })
  difficultyLevel: number;

  @Column({ name: 'target_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  targetValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ name: 'reminder_time', type: 'time', nullable: true })
  reminderTime: string;

  @Column({ name: 'streak_count', type: 'int', default: 0 })
  streakCount: number;

  @Column({ name: 'best_streak', type: 'int', default: 0 })
  bestStreak: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => HabitLog, (log) => log.habit)
  logs: HabitLog[];
}