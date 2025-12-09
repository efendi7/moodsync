// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
// import { Organization } from './organization.entity';
// import { User } from '../../users/entities/user.entity';

// export enum OrganizationMemberRole {
//   EMPLOYEE = 'employee',
//   MANAGER = 'manager',
//   ADMIN = 'admin',
// }

// @Entity('organization_members')
// @Unique(['organization_id', 'user_id'])
// export class OrganizationMember {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'uuid' })
//   organization_id: string;

//   @ManyToOne(() => Organization, org => org.members)
//   @JoinColumn({ name: 'organization_id' })
//   organization: Organization;

//   @Column({ type: 'uuid' })
//   user_id: string;

//   @ManyToOne(() => User, user => user.organizationMemberships)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @Column({ type: 'enum', enum: OrganizationMemberRole, default: OrganizationMemberRole.EMPLOYEE })
//   role: OrganizationMemberRole;

//   @Column({ length: 100, nullable: true })
//   department: string;

//   @CreateDateColumn({ name: 'joined_at' })
//   joined_at: Date;

//   @CreateDateColumn({ name: 'created_at' })
//   created_at: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updated_at: Date;
// }