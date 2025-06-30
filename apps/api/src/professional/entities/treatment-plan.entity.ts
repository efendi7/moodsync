import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TreatmentPlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity('treatment_plans')
export class TreatmentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  coach_id: string;

  @ManyToOne(() => User, user => user.treatmentPlansAsCoach)
  @JoinColumn({ name: 'coach_id' })
  coach: User;

  @Column({ type: 'uuid' })
  client_id: string;

  @ManyToOne(() => User, user => user.treatmentPlansAsClient)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  goals: Record<string, any>[]; // Array of treatment goals

  @Column({ type: 'json', nullable: true })
  interventions: Record<string, any>[]; // Array of recommended activities/strategies

  @Column({ length: 100, nullable: true })
  timeline: string;

  @Column({ type: 'enum', enum: TreatmentPlanStatus, default: TreatmentPlanStatus.DRAFT })
  status: TreatmentPlanStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}