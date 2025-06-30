import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PatternType {
  TRIGGER = 'trigger',
  CORRELATION = 'correlation',
  TREND = 'trend',
}

@Entity('pattern_detections')
export class PatternDetection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.patternDetections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: PatternType, name: 'pattern_type' })
  pattern_type: PatternType;

  @Column({ type: 'json', nullable: true })
  variables: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'strength_score' })
  strength_score: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  recommendations: string[];

  @Column({ type: 'timestamp', name: 'discovered_at' })
  discovered_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}