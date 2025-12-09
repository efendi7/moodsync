import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('mood_entries')
@Index(['userId', 'recordedAt'])
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'mood_score', type: 'tinyint' })
  moodScore: number;

  @Column({ name: 'energy_level', type: 'tinyint', nullable: true })
  energyLevel: number;

  @Column({ name: 'anxiety_level', type: 'tinyint', nullable: true })
  anxietyLevel: number;

  @Column({ name: 'stress_level', type: 'tinyint', nullable: true })
  stressLevel: number;

  @Column({ name: 'happiness_level', type: 'tinyint', nullable: true })
  happinessLevel: number;

  @Column({ name: 'mood_emotions', type: 'json', nullable: true })
  moodEmotions: string[];

  @Column({ name: 'mood_intensity', type: 'tinyint', nullable: true })
  moodIntensity: number;

  @Column({ name: 'context_tags', type: 'json', nullable: true })
  contextTags: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ name: 'weather_condition', type: 'varchar', length: 50, nullable: true })
  weatherCondition: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'photo_url', type: 'varchar', length: 255, nullable: true })
  photoUrl: string;

  @Column({ name: 'voice_note_url', type: 'varchar', length: 255, nullable: true })
  voiceNoteUrl: string;

  @Column({ name: 'recorded_at', type: 'timestamp' })
  recordedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}