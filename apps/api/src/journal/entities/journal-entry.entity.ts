// apps/api/src/journal/entities/journal-entry.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  title: string;

  @Column('text')
  content: string;

  @Column({ name: 'mood_before', type: 'tinyint', nullable: true })
  moodBefore: number;

  @Column({ name: 'mood_after', type: 'tinyint', nullable: true })
  moodAfter: number;

  // ✅ FIX: Hapus default value dari decorator, set nullable
  @Column({ 
    type: 'json',
    nullable: true  // ✅ Ubah jadi nullable
  })
  tags: string[];

  @Column({ name: 'is_private', type: 'tinyint', default: 1 })
  isPrivate: boolean;

  @Column({ name: 'ai_analysis', type: 'json', nullable: true })
  aiAnalysis: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}