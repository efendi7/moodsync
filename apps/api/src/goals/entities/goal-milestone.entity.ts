import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Goal } from './goal.entity';

@Entity('goal_milestones')
export class GoalMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  goal_id: string;

  @ManyToOne(() => Goal, goal => goal.milestones)
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'target_value' })
  target_value: number;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completed_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}