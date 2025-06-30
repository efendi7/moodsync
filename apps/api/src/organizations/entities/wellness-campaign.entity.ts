import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../../users/entities/user.entity'; // Jika campaign memiliki 'created_by' user

export enum CampaignType {
  CHALLENGE = 'challenge',
  INITIATIVE = 'initiative',
  PROGRAM = 'program',
}

@Entity('wellness_campaigns')
export class WellnessCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organization_id: string;

  @ManyToOne(() => Organization, org => org.wellnessCampaigns)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: CampaignType, name: 'campaign_type' })
  campaign_type: CampaignType;

  @Column({ type: 'date', name: 'start_date' })
  start_date: Date;

  @Column({ type: 'date', name: 'end_date' })
  end_date: Date;

  @Column({ type: 'json', nullable: true, name: 'target_metrics' })
  target_metrics: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  rewards: Record<string, any>;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  created_by_user_id: string; // User (admin) yang membuat campaign

  @ManyToOne(() => User, user => user.createdWellnessCampaigns)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}