import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContentLibrary } from './content-library.entity';

export enum MeditationSessionType {
  GUIDED = 'guided',
  BREATHING = 'breathing',
  SLEEP_STORY = 'sleep_story',
}

@Entity('meditation_sessions')
export class MeditationSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.meditationSessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  content_id: string;

  @ManyToOne(() => ContentLibrary, content => content.meditationSessions)
  @JoinColumn({ name: 'content_id' })
  content: ContentLibrary;

  @Column({ type: 'enum', enum: MeditationSessionType, name: 'session_type' })
  session_type: MeditationSessionType;

  @Column({ type: 'int', name: 'duration_planned' })
  duration_planned: number; // in minutes

  @Column({ type: 'int', nullable: true, name: 'duration_actual' })
  duration_actual: number;

  @Column({ type: 'tinyint', nullable: true, name: 'mood_before' })
  mood_before: number; // 1-10

  @Column({ type: 'tinyint', nullable: true, name: 'mood_after' })
  mood_after: number; // 1-10

  @Column({ type: 'tinyint', nullable: true })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', name: 'completed_at' })
  completed_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}