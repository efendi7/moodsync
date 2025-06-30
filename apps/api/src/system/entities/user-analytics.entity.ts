import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_analytics')
export class UserAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.userAnalytics)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', default: 0, name: 'page_views' })
  page_views: number;

  @Column({ type: 'int', default: 0, name: 'session_duration_minutes' })
  session_duration_minutes: number;

  @Column({ type: 'json', nullable: true, name: 'features_used' })
  features_used: Record<string, number>; // e.g., {"mood_tracker": 5, "meditation": 2}

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'engagement_score' })
  engagement_score: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}