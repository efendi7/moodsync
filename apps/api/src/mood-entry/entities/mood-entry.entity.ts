import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('mood_entries')
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.moodEntries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'tinyint' })
  mood_score: number; // 1-10

  @Column({ type: 'tinyint', nullable: true })
  energy_level: number; // 1-10

  @Column({ type: 'tinyint', nullable: true })
  anxiety_level: number; // 1-10

  @Column({ type: 'tinyint', nullable: true })
  stress_level: number; // 1-10

  @Column({ type: 'tinyint', nullable: true })
  happiness_level: number; // 1-10

  @Column({ type: 'json', nullable: true })
  mood_emotions: string[]; // array of emotions

  @Column({ type: 'tinyint', nullable: true })
  mood_intensity: number; // 1-5

  @Column({ type: 'json', nullable: true })
  context_tags: string[];

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ length: 50, nullable: true, name: 'weather_condition' })
  weather_condition: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 255, nullable: true, name: 'photo_url' })
  photo_url: string;

  @Column({ length: 255, nullable: true, name: 'voice_note_url' })
  voice_note_url: string;

  @Column({ type: 'timestamp', name: 'recorded_at' })
  recorded_at: Date; // Kapan mood ini dicatat

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}