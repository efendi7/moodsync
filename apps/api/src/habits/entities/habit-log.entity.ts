import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Habit } from './habit.entity';
import { User } from '../../users/entities/user.entity';

@Entity('habit_logs')
export class HabitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'habit_id', type: 'varchar', length: 255 })
  habitId: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'tinyint' })
  completed: boolean;

  @Column({ name: 'value_achieved', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valueAchieved: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'mood_before', type: 'tinyint', nullable: true })
  moodBefore: number;

  @Column({ name: 'mood_after', type: 'tinyint', nullable: true })
  moodAfter: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Habit, (habit) => habit.logs)
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}