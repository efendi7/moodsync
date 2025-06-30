import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MeditationSession } from './meditation-session.entity';
import { User } from '../../users/entities/user.entity'; // Jika konten bisa dibuat oleh user (admin/coach)

export enum ContentType {
  MEDITATION = 'meditation',
  BREATHING = 'breathing',
  SLEEP_STORY = 'sleep_story',
  ARTICLE = 'article',
}

@Entity('content_library')
export class ContentLibrary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ContentType, name: 'content_type' })
  content_type: ContentType;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'int', nullable: true })
  duration: number; // in minutes

  @Column({ type: 'tinyint', nullable: true, name: 'difficulty_level' })
  difficulty_level: number; // 1-5

  @Column({ length: 255, nullable: true, name: 'audio_url' })
  audio_url: string;

  @Column({ type: 'text', nullable: true, name: 'script_content' })
  script_content: string;

  @Column({ length: 255, nullable: true, name: 'thumbnail_url' })
  thumbnail_url: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'boolean', default: false, name: 'is_premium' })
  is_premium: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'author_id' })
  author_id: string; // Jika konten bisa dibuat oleh user (admin/coach)

  @ManyToOne(() => User, user => user.authoredContent)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => MeditationSession, session => session.content)
  meditationSessions: MeditationSession[];
}