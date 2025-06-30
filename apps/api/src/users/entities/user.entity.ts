// src/users/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne, // Tambahkan OneToOne untuk UserProfile
  // Tambahkan JoinColumn untuk OneToOne
} from 'typeorm';

// Impor semua entitas yang memiliki relasi dengan User
import { MoodEntry } from '../../mood-entry/entities/mood-entry.entity';
import { UserProfile } from '../../user-profile/entities/user-profile.entity'; // Pastikan path benar
import { Habit } from '../../habits/entities/habit.entity'; // Pastikan path benar
import { HabitLog } from '../../habits/entities/habit-log.entity';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity'; // Contoh
import { WellnessScore } from '../../wellness-scores/entities/wellness-score.entity'; // Contoh
import { Goal } from '../../goals/entities/goal.entity'; // Contoh
import { AIInsight } from '../../ai-analytics/entities/ai-insight.entity'; // Contoh
import { AIPrediction } from '../../ai-analytics/entities/ai-prediction.entity'; // Contoh
import { PatternDetection } from '../../ai-analytics/entities/pattern-detection.entity'; // Contoh
import { ContentLibrary } from '../../content-mindfulness/entities/content-library.entity'; 
import { MeditationSession } from '../../content-mindfulness/entities/meditation-session.entity'; // Contoh
import { JournalEntry } from '../../content-mindfulness/entities/journal-entry.entity'; // Contoh
import { SupportCircle } from '../../social-community/entities/support-circle.entity'; // Contoh (jika User membuat circle)
import { CircleMember } from '../../social-community/entities/circle-member.entity'; // Contoh (jika User adalah member circle)
import { CommunityPost } from '../../social-community/entities/community-post.entity'; // Contoh
import { PostInteraction } from '../../social-community/entities/post-interaction.entity'; // Contoh
import { Assessment } from '../../professional/entities/assessment.entity';
import { ClientAssessment } from '../../professional/entities/client-assessment.entity';
import { CoachClient } from '../../professional/entities/coach-client.entity'; // Contoh
import { TreatmentPlan } from '../../professional/entities/treatment-plan.entity'; // Contoh
import { SessionNote } from '../../professional/entities/session-note.entity'; // Contoh
import { Organization } from '../../organizations/entities/organization.entity'; // Make sure this is imported!
import { OrganizationMember } from '../../organizations/entities/organization-member.entity'; // Contoh
import { WellnessCampaign } from '../../organizations/entities/wellness-campaign.entity'; // Contoh
import { UserAnalytics } from '../../system/entities/user-analytics.entity'; // Contoh
import { Notification } from '../../system/entities/notification.entity'; // Contoh

// --- Definisi Enum ---
// Pastikan enum ini juga didefinisikan di file terpisah jika digunakan di banyak tempat.
// Contoh: src/common/enums/user-role.enum.ts
export enum UserRole {
  PERSONAL = 'personal',
  COACH = 'coach',
  ADMIN = 'admin',
}

// Contoh: src/common/enums/subscription-plan.enum.ts
export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

@Entity('users') // Nama tabel di database
export class User {
  @PrimaryGeneratedColumn('uuid') // Menggunakan UUID sesuai skema awal Anda
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string; // Kolom username dari skema awal Anda

  @Column({ name: 'password_hash', nullable: true })
  password_hash: string; // Menyimpan hash kata sandi

  @Column({ name: 'full_name', nullable: true })
  full_name: string; // Kolom full_name dari skema awal Anda

  @Column({ name: 'avatar_url', nullable: true })
  avatar_url: string; // Kolom avatar_url dari skema awal Anda

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  language: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PERSONAL })
  role: UserRole;

  @Column({ type: 'enum', enum: SubscriptionPlan, default: SubscriptionPlan.FREE })
  subscription_plan: SubscriptionPlan;

  @Column({ type: 'timestamp', name: 'subscription_expires_at', nullable: true })
  subscription_expires_at: Date;

  @Column({ type: 'timestamp', name: 'email_verified_at', nullable: true })
  email_verified_at: Date;

  @Column({ name: 'onboarding_completed', default: false })
  onboarding_completed: boolean;

  @Column({ type: 'json', name: 'privacy_settings', nullable: true })
  privacy_settings: Record<string, any>; // JSON untuk pengaturan privasi

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date; // Perhatikan nama kolom konsisten dengan skema Anda

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date; // Perhatikan nama kolom konsisten dengan skema Anda

  // --- Oauth (misalnya Google) ---
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'google_id', unique: true })
  googleId?: string; // ID dari penyedia OAuth (misalnya Google)

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'profile_picture' })
  profilePicture?: string; // URL gambar profil dari OAuth

  // --- Relasi ke Entitas Lain ---

  // 1. UserProfile (OneToOne)
  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
 // JoinColumn di sisi pemilik relasi
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
  // INI ADALAH BARIS YANG HILANG ATAU SALAH DI SISI USER
  @OneToMany(() => HabitLog, habitLog => habitLog.user) // `habitLog.user` menunjuk balik ke properti `user` di HabitLog
  habitLogs: HabitLog[]; // <-- Pastikan properti ini ada di User entity

  // Anda juga perlu OneToMany ke HabitLog jika Anda ingin akses langsung dari User
  // @OneToMany(() => HabitLog, (habitLog) => habitLog.user)
  // habitLogs: HabitLog[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  // 4. AI & Analytics
  @OneToMany(() => AIInsight, (aiInsight) => aiInsight.user)
  aiInsights: AIInsight[];

  @OneToMany(() => AIPrediction, (aiPrediction) => aiPrediction.user)
  aiPredictions: AIPrediction[];

  @OneToMany(() => PatternDetection, (patternDetection) => patternDetection.user)
  patternDetections: PatternDetection[];

  // 5. Content & Mindfulness
  @OneToMany(() => MeditationSession, (meditationSession) => meditationSession.user)
  meditationSessions: MeditationSession[];

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user)
  journalEntries: JournalEntry[];

   @OneToMany(() => ContentLibrary, content => content.author) // `content.author` points back to the `author` property in ContentLibrary
  authoredContent: ContentLibrary[]; // <-- Ensure this property exists and is correctly typed

  // 6. Social & Community
  @OneToMany(() => SupportCircle, (circle) => circle.createdBy) // User bisa membuat SupportCircle
  supportCirclesCreated: SupportCircle[];

  @OneToMany(() => CircleMember, (member) => member.user) // User bisa menjadi member dari Circle
  circleMemberships: CircleMember[];

  @OneToMany(() => CommunityPost, (post) => post.user)
  communityPosts: CommunityPost[];

  @OneToMany(() => PostInteraction, (interaction) => interaction.user)
  postInteractions: PostInteraction[];

  // 7. Professional Features (Coach/Client)

   @OneToMany(() => Assessment, assessment => assessment.createdBy)
  createdAssessments: Assessment[]; // <-- Ensure this property exists and is correctly typed

  @OneToMany(() => ClientAssessment, clientAssessment => clientAssessment.client)
  clientAssessments: ClientAssessment[]; // <-- Pastikan properti ini ada

  // Untuk coach yang menugaskan penilaian
  @OneToMany(() => ClientAssessment, clientAssessment => clientAssessment.coach)
  assignedClientAssessments: ClientAssessment[]; // <-- Pastikan properti ini ada
  @OneToMany(() => CoachClient, (coachClient) => coachClient.coach) // Jika User adalah coach
  coachingClients: CoachClient[];

  @OneToMany(() => CoachClient, (coachClient) => coachClient.client) // Jika User adalah client
  clientOfCoaches: CoachClient[];

  @OneToMany(() => TreatmentPlan, (plan) => plan.coach)
  treatmentPlansAsCoach: TreatmentPlan[];

  @OneToMany(() => TreatmentPlan, (plan) => plan.client)
  treatmentPlansAsClient: TreatmentPlan[];

  @OneToMany(() => SessionNote, (note) => note.coach)
  sessionNotesAsCoach: SessionNote[];

  @OneToMany(() => SessionNote, (note) => note.client)
  sessionNotesAsClient: SessionNote[];

  // 8. Organization/Enterprise
  @OneToMany(() => OrganizationMember, (orgMember) => orgMember.user)
  organizationMemberships: OrganizationMember[];

   @OneToMany(() => Organization, org => org.adminUser) // `org.adminUser` points back to the `adminUser` property in Organization
  administeredOrganizations: Organization[]; // <-- Ensure this property exists and is correctly typed

    @OneToMany(() => WellnessCampaign, campaign => campaign.createdBy)
  createdWellnessCampaigns: WellnessCampaign[];
  // 9. System & Analytics
  @OneToMany(() => UserAnalytics, (analytics) => analytics.user)
  userAnalytics: UserAnalytics[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}