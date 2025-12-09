// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
// import { Assessment } from './assessment.entity';

// @Entity('client_assessments')
// export class ClientAssessment {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'uuid' })
//   assessment_id: string;

//   @ManyToOne(() => Assessment, assessment => assessment.clientAssessments)
//   @JoinColumn({ name: 'assessment_id' })
//   assessment: Assessment;

//   @Column({ type: 'uuid' })
//   client_id: string;

//   @ManyToOne(() => User, user => user.clientAssessments)
//   @JoinColumn({ name: 'client_id' })
//   client: User;

//   @Column({ type: 'uuid', nullable: true })
//   coach_id: string; // Who assigned it

//   @ManyToOne(() => User, user => user.assignedClientAssessments)
//   @JoinColumn({ name: 'coach_id' })
//   coach: User;

//   @Column({ type: 'timestamp', name: 'assigned_at' })
//   assigned_at: Date;

//   @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
//   completed_at: Date;

//   @Column({ type: 'json' })
//   answers: Record<string, any>;

//   @Column({ type: 'json', nullable: true, name: 'score_results' })
//   score_results: Record<string, any>;

//   @Column({ type: 'text', nullable: true })
//   notes: string;

//   @CreateDateColumn({ name: 'created_at' })
//   created_at: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updated_at: Date;
// }