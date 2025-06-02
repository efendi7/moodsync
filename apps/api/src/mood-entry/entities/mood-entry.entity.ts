import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity()
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.moodEntries)
  user: User;

  @Column()
  emotion: string;

  @Column('int')
  intensity: number;

  @Column('simple-array', { nullable: true })
  contextTags: string[];

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  voiceNoteUrl: string;

  @Column({ type: 'timestamp' })
  loggedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
