import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  REMINDER = 'reminder',
  INSIGHT = 'insight',
  ALERT = 'alert',
  SOCIAL = 'social',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>; // additional context/payload

  @Column({ type: 'boolean', default: false, name: 'is_read' })
  is_read: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_clicked' })
  is_clicked: boolean;

  @Column({ type: 'timestamp', name: 'sent_at' })
  sent_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}