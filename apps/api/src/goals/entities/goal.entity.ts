import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GoalMilestone } from './goal-milestone.entity';
import { GoalStatus } from '../enums/goal-status.enum';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({
    name: 'target_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  targetValue: number;

  @Column({
    name: 'current_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  currentValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ name: 'target_date', type: 'date' })
  targetDate: Date;

  @Column({ type: 'tinyint', default: 3 })
  priority: number;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.ACTIVE,
  })
  status: GoalStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.goals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => GoalMilestone, (milestone) => milestone.goal)
  milestones: GoalMilestone[];
}