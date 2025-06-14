import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { MoodEntry } from '@/mood-entry/entities/mood-entry.entity';

@Entity('users') // Nama tabel di database
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true })
  password?: string; // Nullable untuk pengguna Google OAuth

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'google_id', unique: true })
  googleId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'profile_picture' })
  profilePicture?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => MoodEntry, (moodEntry) => moodEntry.user)
  moodEntries?: MoodEntry[];
}
