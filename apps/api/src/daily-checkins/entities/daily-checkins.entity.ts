import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('daily_checkins')
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.dailyCheckins)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'tinyint', nullable: true })
  morning_mood: number;

  @Column({ type: 'tinyint', nullable: true })
  evening_mood: number;

  @Column({ type: 'tinyint', nullable: true })
  sleep_quality: number; // 1-10

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  sleep_hours: number;

  @Column({ type: 'tinyint', nullable: true })
  productivity_score: number; // 1-10

  @Column({ type: 'text', nullable: true, name: 'gratitude_notes' })
  gratitude_notes: string;

  @Column({ type: 'text', nullable: true, name: 'daily_highlight' })
  daily_highlight: string;

  @Column({ type: 'json', nullable: true })
  challenges_faced: string[];

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completed_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}