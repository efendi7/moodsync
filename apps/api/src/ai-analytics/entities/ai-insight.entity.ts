import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum InsightType {
  PATTERN = 'pattern',
  RECOMMENDATION = 'recommendation',
  PREDICTION = 'prediction',
  ALERT = 'alert',
}

@Entity('ai_insights')
export class AIInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.aiInsights)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: InsightType, name: 'insight_type' })
  insight_type: InsightType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'confidence_score' })
  confidence_score: number;

  @Column({ type: 'json', nullable: true, name: 'data_sources' })
  data_sources: string[];

  @Column({ type: 'boolean', default: false, name: 'is_read' })
  is_read: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_dismissed' })
  is_dismissed: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expires_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}