import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('wellness_scores')
export class WellnessScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.wellnessScores)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overall_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  mental_health_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  physical_health_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  social_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  productivity_score: number;

  @Column({ type: 'json', nullable: true })
  factors: Record<string, any>; // breakdown of score components

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}