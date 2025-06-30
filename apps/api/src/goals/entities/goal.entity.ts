import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GoalMilestone } from './goal-milestone.entity';

export enum GoalStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.goals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'target_value' })
  target_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'current_value' })
  current_value: number;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({ type: 'date', name: 'target_date' })
  target_date: Date;

  @Column({ type: 'tinyint', default: 3 })
  priority: number; // 1-5

  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ACTIVE })
  status: GoalStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => GoalMilestone, milestone => milestone.goal)
  milestones: GoalMilestone[];
}