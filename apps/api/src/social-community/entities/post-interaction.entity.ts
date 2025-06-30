import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { CommunityPost } from './community-post.entity';
import { User } from '../../users/entities/user.entity';

export enum InteractionType {
  LIKE = 'like',
  COMMENT = 'comment',
  REPORT = 'report',
}

@Entity('post_interactions')
@Unique(['post_id', 'user_id', 'interaction_type']) // Ensures a user can only like/report a post once
export class PostInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  post_id: string;

  @ManyToOne(() => CommunityPost, post => post.interactions)
  @JoinColumn({ name: 'post_id' })
  post: CommunityPost;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.postInteractions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: InteractionType, name: 'interaction_type' })
  interaction_type: InteractionType;

  @Column({ type: 'text', nullable: true })
  content: string; // for comments

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}