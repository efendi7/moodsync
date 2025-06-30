import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SupportCircle } from './support-circle.entity';
import { PostInteraction } from './post-interaction.entity';

export enum CommunityPostType {
  DISCUSSION = 'discussion',
  QUESTION = 'question',
  SUPPORT = 'support',
  CELEBRATION = 'celebration',
}

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.communityPosts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  circle_id: string;

  @ManyToOne(() => SupportCircle, circle => circle.posts)
  @JoinColumn({ name: 'circle_id' })
  circle: SupportCircle; // Nullable if post is in general community

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false, name: 'is_anonymous' })
  is_anonymous: boolean;

  @Column({ type: 'enum', enum: CommunityPostType, name: 'post_type' })
  post_type: CommunityPostType;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0, name: 'likes_count' })
  likes_count: number;

  @Column({ type: 'int', default: 0, name: 'comments_count' })
  comments_count: number;

  @Column({ type: 'boolean', default: false, name: 'is_flagged' })
  is_flagged: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => PostInteraction, interaction => interaction.post)
  interactions: PostInteraction[];
}