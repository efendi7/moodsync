import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { SupportCircle } from './support-circle.entity';
import { User } from '../../users/entities/user.entity';

export enum CircleMemberRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

@Entity('circle_members')
@Unique(['circle_id', 'user_id']) // Menjamin user hanya sekali jadi member di 1 circle
export class CircleMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  circle_id: string;

  @ManyToOne(() => SupportCircle, circle => circle.members)
  @JoinColumn({ name: 'circle_id' })
  circle: SupportCircle;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.circleMemberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: CircleMemberRole, default: CircleMemberRole.MEMBER })
  role: CircleMemberRole;

  @CreateDateColumn({ name: 'joined_at' }) // Joined date
  joined_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}