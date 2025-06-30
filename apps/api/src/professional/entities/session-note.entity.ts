import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SessionType {
  THERAPY = 'therapy',
  COACHING = 'coaching',
  CHECK_IN = 'check-in',
}

@Entity('session_notes')
export class SessionNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  coach_id: string;

  @ManyToOne(() => User, user => user.sessionNotesAsCoach)
  @JoinColumn({ name: 'coach_id' })
  coach: User;

  @Column({ type: 'uuid' })
  client_id: string;

  @ManyToOne(() => User, user => user.sessionNotesAsClient)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ type: 'timestamp', name: 'session_date' })
  session_date: Date;

  @Column({ type: 'enum', enum: SessionType, name: 'session_type' })
  session_type: SessionType;

  @Column({ type: 'int', nullable: true })
  duration: number; // in minutes

  @Column({ type: 'text' })
  notes: string;

  @Column({ type: 'json', nullable: true, name: 'homework_assigned' })
  homework_assigned: Record<string, any>[];

  @Column({ type: 'text', nullable: true, name: 'next_session_plan' })
  next_session_plan: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}