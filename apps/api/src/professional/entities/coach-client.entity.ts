import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RelationshipType {
  THERAPIST = 'therapist',
  COACH = 'coach',
  MENTOR = 'mentor',
}

export enum CoachClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Entity('coach_clients')
@Unique(['coach_id', 'client_id']) // A coach can only have one relationship with a client
export class CoachClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  coach_id: string;

  @ManyToOne(() => User, user => user.coachingClients)
  @JoinColumn({ name: 'coach_id' })
  coach: User;

  @Column({ type: 'uuid' })
  client_id: string;

  @ManyToOne(() => User, user => user.clientOfCoaches)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ type: 'enum', enum: RelationshipType, name: 'relationship_type' })
  relationship_type: RelationshipType;

  @Column({ type: 'enum', enum: CoachClientStatus, default: CoachClientStatus.ACTIVE })
  status: CoachClientStatus;

  @Column({ type: 'json', nullable: true })
  permissions: Record<string, any>; // What data coach can access

  @Column({ type: 'timestamp', name: 'started_at' })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'ended_at' })
  ended_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}