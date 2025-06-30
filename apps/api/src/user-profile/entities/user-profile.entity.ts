// src/user-profiles/entities/user-profile.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Sesuaikan path

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ length: 50, nullable: true })
  gender: string;

  @Column({ length: 100, nullable: true })
  occupation: string;

  @Column({ length: 50, nullable: true })
  personality_type: string;

  @Column({ type: 'json', nullable: true })
  wellness_goals: Record<string, any>; // Gunakan Record<string, any> atau antarmuka yang lebih spesifik

  @Column({ length: 100, nullable: true })
  cultural_background: string;

  @Column({ type: 'json', nullable: true })
  preferred_themes: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  notification_preferences: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  emergency_contact: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}