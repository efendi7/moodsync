import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Habit } from './habit.entity';
import { User } from '../../users/entities/user.entity';

@Entity('habit_logs')
export class HabitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  habit_id: string;

  @ManyToOne(() => Habit, habit => habit.habitLogs)
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @Column({ type: 'uuid' })
  user_id: string; // Redundansi untuk kemudahan query, atau jika habit bisa dibagikan

  @ManyToOne(() => User, user => user.habitLogs) // Relasi ke User
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean' })
  completed: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'value_achieved' })
  value_achieved: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'tinyint', nullable: true, name: 'mood_before' })
  mood_before: number; // 1-10

  @Column({ type: 'tinyint', nullable: true, name: 'mood_after' })
  mood_after: number; // 1-10

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}