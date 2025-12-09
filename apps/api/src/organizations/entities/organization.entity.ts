// import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
// import { OrganizationMember } from './organization-member.entity';
// import { WellnessCampaign } from './wellness-campaign.entity';

// export enum OrganizationPlanType {
//   ENTERPRISE = 'enterprise',
//   CORPORATE = 'corporate',
// }

// @Entity('organizations')
// export class Organization {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ length: 255, unique: true })
//   name: string;

//   @Column({ length: 255, unique: true, nullable: true })
//   domain: string; // For email domain verification

//   @Column({ type: 'enum', enum: OrganizationPlanType, name: 'plan_type' })
//   plan_type: OrganizationPlanType;

//   @Column({ type: 'int', nullable: true, name: 'employee_limit' })
//   employee_limit: number;

//   @Column({ type: 'uuid', name: 'admin_user_id' })
//   admin_user_id: string; // Super admin organisasi

//   @ManyToOne(() => User, user => user.administeredOrganizations)
//   @JoinColumn({ name: 'admin_user_id' })
//   adminUser: User;

//   @Column({ type: 'json', nullable: true })
//   settings: Record<string, any>;

//   @CreateDateColumn({ name: 'created_at' })
//   created_at: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updated_at: Date;

//   @OneToMany(() => OrganizationMember, member => member.organization)
//   members: OrganizationMember[];

//   @OneToMany(() => WellnessCampaign, campaign => campaign.organization)
//   wellnessCampaigns: WellnessCampaign[];
// }