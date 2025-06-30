import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PredictionType {
  MOOD = 'mood',
  ENERGY = 'energy',
  PRODUCTIVITY = 'productivity',
}

@Entity('ai_predictions')
export class AIPrediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.aiPredictions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: PredictionType, name: 'prediction_type' })
  prediction_type: PredictionType;

  @Column({ type: 'date', name: 'predicted_date' })
  predicted_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'predicted_value' })
  predicted_value: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'confidence_score' })
  confidence_score: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'actual_value' })
  actual_value: number; // Filled later

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'accuracy_score' })
  accuracy_score: number; // Calculated

  @Column({ length: 50, nullable: true, name: 'model_version' })
  model_version: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}