import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CircleMember } from './circle-member.entity';
import { CommunityPost } from './community-post.entity';

@Entity('support_circles')
export class SupportCircle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', name: 'created_by' })
  created_by_user_id: string; // Renamed to avoid conflict with relation property 'createdBy'

  @ManyToOne(() => User, user => user.supportCirclesCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ type: 'boolean', default: true, name: 'is_private' })
  is_private: boolean;

  @Column({ type: 'int', nullable: true, name: 'member_limit' })
  member_limit: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => CircleMember, member => member.circle)
  members: CircleMember[];

  @OneToMany(() => CommunityPost, post => post.circle)
  posts: CommunityPost[];
}