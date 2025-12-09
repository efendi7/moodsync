// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
// import { ClientAssessment } from './client-assessment.entity';

// @Entity('assessments')
// export class Assessment {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'uuid', name: 'created_by' })
//   created_by_user_id: string;

//   @ManyToOne(() => User, user => user.createdAssessments)
//   @JoinColumn({ name: 'created_by' })
//   createdBy: User;

//   @Column({ length: 255 })
//   title: string;

//   @Column({ type: 'text', nullable: true })
//   description: string;

//   @Column({ length: 100, name: 'assessment_type' })
//   assessment_type: string;

//   @Column({ type: 'json' })
//   questions: Record<string, any>[];

//   @Column({ type: 'json', nullable: true, name: 'scoring_logic' })
//   scoring_logic: Record<string, any>;

//   @Column({ type: 'boolean', default: false, name: 'is_template' })
//   is_template: boolean;

//   @CreateDateColumn({ name: 'created_at' })
//   created_at: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updated_at: Date;

//   @OneToMany(() => ClientAssessment, clientAssessment => clientAssessment.assessment)
//   clientAssessments: ClientAssessment[];
// }