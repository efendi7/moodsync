// src/users/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

// ✅ Import entitas yang SUDAH DIBUAT
import { MoodEntry } from '../../mood-entry/entities/mood-entry.entity';
import { UserProfile } from '../../user-profile/entities/user-profile.entity';
import { Habit } from '../../habits/entities/habit.entity';
import { JournalEntry } from '../../journal/entities/journal-entry.entity';
import { HabitLog } from '../../habits/entities/habit-log.entity';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkins.entity';
import { WellnessScore } from '../../wellness-scores/entities/wellness-score.entity';
import { Goal } from '../../goals/entities/goal.entity';

// ❌ COMMENT DULU - Belum dibuat entitynya
// import { AIInsight } from '../../ai-analytics/entities/ai-insight.entity';
// import { AIPrediction } from '../../ai-analytics/entities/ai-prediction.entity';
// import { PatternDetection } from '../../ai-analytics/entities/pattern-detection.entity';
// import { ContentLibrary } from '../../content-mindfulness/entities/content-library.entity';
// import { MeditationSession } from '../../content-mindfulness/entities/meditation-session.entity';

// import { SupportCircle } from '../../social-community/entities/support-circle.entity';
// import { CircleMember } from '../../social-community/entities/circle-member.entity';
// import { CommunityPost } from '../../social-community/entities/community-post.entity';
// import { PostInteraction } from '../../social-community/entities/post-interaction.entity';
// import { Assessment } from '../../professional/entities/assessment.entity';
// import { ClientAssessment } from '../../professional/entities/client-assessment.entity';
// import { CoachClient } from '../../professional/entities/coach-client.entity';
// import { TreatmentPlan } from '../../professional/entities/treatment-plan.entity';
// import { SessionNote } from '../../professional/entities/session-note.entity';
// import { Organization } from '../../organizations/entities/organization.entity';
// import { OrganizationMember } from '../../organizations/entities/organization-member.entity';
// import { WellnessCampaign } from '../../organizations/entities/wellness-campaign.entity';
// import { UserAnalytics } from '../../system/entities/user-analytics.entity';
// import { Notification } from '../../system/entities/notification.entity';

// --- Definisi Enum ---
export enum UserRole {
  PERSONAL = 'personal',
  COACH = 'coach',
  ADMIN = 'admin',
}

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash', nullable: true })
  password_hash: string;

  @Column({ name: 'full_name', nullable: true })
  full_name: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  language: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PERSONAL })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  subscription_plan: SubscriptionPlan;

  @Column({
    type: 'timestamp',
    name: 'subscription_expires_at',
    nullable: true,
  })
  subscription_expires_at: Date;

  @Column({ type: 'timestamp', name: 'email_verified_at', nullable: true })
  email_verified_at: Date;

  @Column({ name: 'onboarding_completed', default: false })
  onboarding_completed: boolean;

  @Column({ type: 'json', name: 'privacy_settings', nullable: true })
  privacy_settings: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // --- OAuth (Google) ---
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'google_id',
    unique: true,
  })
  googleId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'profile_picture',
  })
  profilePicture?: string;

  // =========================================================================
  // ✅ RELASI YANG SUDAH AKTIF (Entity sudah dibuat)
  // =========================================================================

  // 1. UserProfile (OneToOne)
  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  profile: UserProfile;

  // 2. Mood & Wellness Tracking
  @OneToMany(() => MoodEntry, (moodEntry) => moodEntry.user)
  moodEntries: MoodEntry[];

  @OneToMany(() => DailyCheckin, (dailyCheckin) => dailyCheckin.user)
  dailyCheckins: DailyCheckin[];

  @OneToMany(() => WellnessScore, (wellnessScore) => wellnessScore.user)
  wellnessScores: WellnessScore[];

  // 3. Habits & Goals Management
  @OneToMany(() => Habit, (habit) => habit.user)
  habits: Habit[];

  @OneToMany(() => HabitLog, (habitLog) => habitLog.user)
  habitLogs: HabitLog[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  // =========================================================================
  // ❌ RELASI YANG DI-COMMENT (Uncomment nanti setelah entity dibuat)
  // =========================================================================

  // // 4. AI & Analytics
  // @OneToMany(() => AIInsight, (aiInsight) => aiInsight.user)
  // aiInsights: AIInsight[];

  // @OneToMany(() => AIPrediction, (aiPrediction) => aiPrediction.user)
  // aiPredictions: AIPrediction[];

  // @OneToMany(() => PatternDetection, (patternDetection) => patternDetection.user)
  // patternDetections: PatternDetection[];

  // // 5. Content & Mindfulness
  // @OneToMany(() => MeditationSession, (meditationSession) => meditationSession.user)
  // meditationSessions: MeditationSession[];

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user)
  journalEntries: JournalEntry[];

  // @OneToMany(() => ContentLibrary, (content) => content.author)
  // authoredContent: ContentLibrary[];

  // // 6. Social & Community
  // @OneToMany(() => SupportCircle, (circle) => circle.createdBy)
  // supportCirclesCreated: SupportCircle[];

  // @OneToMany(() => CircleMember, (member) => member.user)
  // circleMemberships: CircleMember[];

  // @OneToMany(() => CommunityPost, (post) => post.user)
  // communityPosts: CommunityPost[];

  // @OneToMany(() => PostInteraction, (interaction) => interaction.user)
  // postInteractions: PostInteraction[];

  // // 7. Professional Features (Coach/Client)
  // @OneToMany(() => Assessment, (assessment) => assessment.createdBy)
  // createdAssessments: Assessment[];

  // @OneToMany(() => ClientAssessment, (clientAssessment) => clientAssessment.client)
  // clientAssessments: ClientAssessment[];

  // @OneToMany(() => ClientAssessment, (clientAssessment) => clientAssessment.coach)
  // assignedClientAssessments: ClientAssessment[];

  // @OneToMany(() => CoachClient, (coachClient) => coachClient.coach)
  // coachingClients: CoachClient[];

  // @OneToMany(() => CoachClient, (coachClient) => coachClient.client)
  // clientOfCoaches: CoachClient[];

  // @OneToMany(() => TreatmentPlan, (plan) => plan.coach)
  // treatmentPlansAsCoach: TreatmentPlan[];

  // @OneToMany(() => TreatmentPlan, (plan) => plan.client)
  // treatmentPlansAsClient: TreatmentPlan[];

  // @OneToMany(() => SessionNote, (note) => note.coach)
  // sessionNotesAsCoach: SessionNote[];

  // @OneToMany(() => SessionNote, (note) => note.client)
  // sessionNotesAsClient: SessionNote[];

  // // 8. Organization/Enterprise
  // @OneToMany(() => OrganizationMember, (orgMember) => orgMember.user)
  // organizationMemberships: OrganizationMember[];

  // @OneToMany(() => Organization, (org) => org.adminUser)
  // administeredOrganizations: Organization[];

  // @OneToMany(() => WellnessCampaign, (campaign) => campaign.createdBy)
  // createdWellnessCampaigns: WellnessCampaign[];

  // // 9. System & Analytics
  // @OneToMany(() => UserAnalytics, (analytics) => analytics.user)
  // userAnalytics: UserAnalytics[];

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];
}