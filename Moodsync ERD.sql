CREATE TABLE `users` (
  `id` varchar(36) PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255),
  `full_name` varchar(255),
  `avatar_url` varchar(255),
  `timezone` varchar(255),
  `language` varchar(255),
  `role` enum(personal,coach,admin) DEFAULT 'personal',
  `subscription_plan` enum(free,premium,pro,enterprise) DEFAULT 'free',
  `subscription_expires_at` timestamp,
  `email_verified_at` timestamp,
  `onboarding_completed` tinyint DEFAULT 0,
  `privacy_settings` json,
  `google_id` varchar(255) UNIQUE,
  `profile_picture` varchar(255),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `user_profiles` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) UNIQUE NOT NULL,
  `date_of_birth` date,
  `gender` varchar(50),
  `occupation` varchar(100),
  `personality_type` varchar(50),
  `wellness_goals` json,
  `cultural_background` varchar(100),
  `preferred_themes` json,
  `notification_preferences` json,
  `emergency_contact` json,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `mood_entries` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `mood_score` tinyint NOT NULL,
  `energy_level` tinyint,
  `anxiety_level` tinyint,
  `stress_level` tinyint,
  `happiness_level` tinyint,
  `mood_emotions` json,
  `mood_intensity` tinyint,
  `context_tags` json,
  `location` varchar(255),
  `weather_condition` varchar(50),
  `notes` text,
  `photo_url` varchar(255),
  `voice_note_url` varchar(255),
  `recorded_at` timestamp NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `habits` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) NOT NULL,
  `frequency_type` enum(daily,weekly,custom) NOT NULL,
  `frequency_value` json,
  `difficulty_level` tinyint NOT NULL,
  `target_value` decimal(10,2),
  `unit` varchar(50),
  `reminder_time` time,
  `streak_count` int DEFAULT 0,
  `best_streak` int DEFAULT 0,
  `is_active` tinyint DEFAULT 1,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `habit_logs` (
  `id` varchar(36) PRIMARY KEY,
  `habit_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `completed` tinyint NOT NULL,
  `value_achieved` decimal(10,2),
  `notes` text,
  `mood_before` tinyint,
  `mood_after` tinyint,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `goals` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) NOT NULL,
  `target_value` decimal(10,2),
  `current_value` decimal(10,2) DEFAULT 0,
  `unit` varchar(50),
  `target_date` date NOT NULL,
  `priority` tinyint DEFAULT 3,
  `status` enum(active,paused,completed,cancelled) DEFAULT 'active',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `goal_milestones` (
  `id` varchar(36) PRIMARY KEY,
  `goal_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `target_value` decimal(10,2),
  `completed_at` timestamp,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `daily_checkins` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `morning_mood` tinyint,
  `evening_mood` tinyint,
  `sleep_quality` tinyint,
  `sleep_hours` decimal(4,2),
  `productivity_score` tinyint,
  `gratitude_notes` text,
  `daily_highlight` text,
  `challenges_faced` json,
  `completed_at` timestamp,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `journal_entries` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `title` varchar(255),
  `content` text NOT NULL,
  `mood_before` tinyint,
  `mood_after` tinyint,
  `tags` json,
  `is_private` tinyint DEFAULT 1,
  `ai_analysis` json,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `content_library` (
  `id` varchar(36) PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content_type` enum(meditation,breathing,sleep_story,article) NOT NULL,
  `category` varchar(100),
  `duration` int,
  `difficulty_level` tinyint,
  `audio_url` varchar(255),
  `script_content` text,
  `thumbnail_url` varchar(255),
  `tags` json,
  `is_premium` tinyint DEFAULT 0,
  `author_id` varchar(255),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `meditation_sessions` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `content_id` varchar(255) NOT NULL,
  `session_type` enum(guided,breathing,sleep_story) NOT NULL,
  `duration_planned` int NOT NULL,
  `duration_actual` int,
  `mood_before` tinyint,
  `mood_after` tinyint,
  `rating` tinyint,
  `notes` text,
  `completed_at` timestamp NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `support_circles` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_by` varchar(255) NOT NULL,
  `is_private` tinyint DEFAULT 1,
  `member_limit` int,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `circle_members` (
  `id` varchar(36) PRIMARY KEY,
  `circle_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `role` enum(member,moderator,admin) DEFAULT 'member',
  `joined_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `community_posts` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `circle_id` varchar(255),
  `title` varchar(255),
  `content` text NOT NULL,
  `is_anonymous` tinyint DEFAULT 0,
  `post_type` enum(discussion,question,support,celebration) NOT NULL,
  `tags` json,
  `likes_count` int DEFAULT 0,
  `comments_count` int DEFAULT 0,
  `is_flagged` tinyint DEFAULT 0,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `post_interactions` (
  `id` varchar(36) PRIMARY KEY,
  `post_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `interaction_type` enum(like,comment,report) NOT NULL,
  `content` text,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `ai_insights` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `insight_type` enum(pattern,recommendation,prediction,alert) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `confidence_score` decimal(5,2),
  `data_sources` json,
  `is_read` tinyint DEFAULT 0,
  `is_dismissed` tinyint DEFAULT 0,
  `expires_at` timestamp,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `ai_predictions` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `prediction_type` enum(mood,energy,productivity) NOT NULL,
  `predicted_date` date NOT NULL,
  `predicted_value` decimal(5,2) NOT NULL,
  `confidence_score` decimal(5,2),
  `actual_value` decimal(5,2),
  `accuracy_score` decimal(5,2),
  `model_version` varchar(50),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `pattern_detections` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `pattern_type` enum(trigger,correlation,trend) NOT NULL,
  `variables` json,
  `strength_score` decimal(5,2),
  `description` text NOT NULL,
  `recommendations` json,
  `discovered_at` timestamp NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `assessments` (
  `id` varchar(36) PRIMARY KEY,
  `created_by` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `assessment_type` varchar(100) NOT NULL,
  `questions` json NOT NULL,
  `scoring_logic` json,
  `is_template` tinyint DEFAULT 0,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `client_assessments` (
  `id` varchar(36) PRIMARY KEY,
  `assessment_id` varchar(255) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `coach_id` varchar(255),
  `assigned_at` timestamp NOT NULL,
  `completed_at` timestamp,
  `answers` json NOT NULL,
  `score_results` json,
  `notes` text,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `coach_clients` (
  `id` varchar(36) PRIMARY KEY,
  `coach_id` varchar(255) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `relationship_type` enum(therapist,coach,mentor) NOT NULL,
  `status` enum(active,inactive,completed) DEFAULT 'active',
  `permissions` json,
  `started_at` timestamp NOT NULL,
  `ended_at` timestamp,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `treatment_plans` (
  `id` varchar(36) PRIMARY KEY,
  `coach_id` varchar(255) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `goals` json,
  `interventions` json,
  `timeline` varchar(100),
  `status` enum(draft,active,completed) DEFAULT 'draft',
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `session_notes` (
  `id` varchar(36) PRIMARY KEY,
  `coach_id` varchar(255) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `session_date` timestamp NOT NULL,
  `session_type` enum(therapy,coaching,check-in) NOT NULL,
  `duration` int,
  `notes` text NOT NULL,
  `homework_assigned` json,
  `next_session_plan` text,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `organizations` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `domain` varchar(255) UNIQUE,
  `plan_type` enum(enterprise,corporate) NOT NULL,
  `employee_limit` int,
  `admin_user_id` varchar(255) NOT NULL,
  `settings` json,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `organization_members` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `role` enum(employee,manager,admin) DEFAULT 'employee',
  `department` varchar(100),
  `joined_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `wellness_campaigns` (
  `id` varchar(36) PRIMARY KEY,
  `organization_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `campaign_type` enum(challenge,initiative,program) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `target_metrics` json,
  `rewards` json,
  `is_active` tinyint DEFAULT 1,
  `created_by` varchar(255),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE TABLE `wellness_scores` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `overall_score` decimal(5,2) NOT NULL,
  `mental_health_score` decimal(5,2),
  `physical_health_score` decimal(5,2),
  `social_score` decimal(5,2),
  `productivity_score` decimal(5,2),
  `factors` json,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `user_analytics` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `page_views` int DEFAULT 0,
  `session_duration_minutes` int DEFAULT 0,
  `features_used` json,
  `engagement_score` decimal(5,2),
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `notifications` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255) NOT NULL,
  `type` enum(reminder,insight,alert,social,system) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` json,
  `is_read` tinyint DEFAULT 0,
  `is_clicked` tinyint DEFAULT 0,
  `sent_at` timestamp NOT NULL,
  `created_at` datetime DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `app_settings` (
  `id` varchar(36) PRIMARY KEY,
  `key` varchar(255) UNIQUE NOT NULL,
  `value` json NOT NULL,
  `description` text,
  `updated_at` datetime DEFAULT (CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX `circle_members_index_0` ON `circle_members` (`circle_id`, `user_id`);

CREATE UNIQUE INDEX `post_interactions_index_1` ON `post_interactions` (`post_id`, `user_id`, `interaction_type`);

CREATE UNIQUE INDEX `coach_clients_index_2` ON `coach_clients` (`coach_id`, `client_id`);

CREATE UNIQUE INDEX `organization_members_index_3` ON `organization_members` (`organization_id`, `user_id`);

ALTER TABLE `user_profiles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `mood_entries` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `habits` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `habit_logs` ADD FOREIGN KEY (`habit_id`) REFERENCES `habits` (`id`);

ALTER TABLE `habit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `goals` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `goal_milestones` ADD FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`);

ALTER TABLE `daily_checkins` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `journal_entries` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `content_library` ADD FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

ALTER TABLE `meditation_sessions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `meditation_sessions` ADD FOREIGN KEY (`content_id`) REFERENCES `content_library` (`id`);

ALTER TABLE `support_circles` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `circle_members` ADD FOREIGN KEY (`circle_id`) REFERENCES `support_circles` (`id`);

ALTER TABLE `circle_members` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `community_posts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `community_posts` ADD FOREIGN KEY (`circle_id`) REFERENCES `support_circles` (`id`);

ALTER TABLE `post_interactions` ADD FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`);

ALTER TABLE `post_interactions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `ai_insights` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `ai_predictions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `pattern_detections` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `assessments` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `client_assessments` ADD FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`);

ALTER TABLE `client_assessments` ADD FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

ALTER TABLE `client_assessments` ADD FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`);

ALTER TABLE `coach_clients` ADD FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`);

ALTER TABLE `coach_clients` ADD FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

ALTER TABLE `treatment_plans` ADD FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`);

ALTER TABLE `treatment_plans` ADD FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

ALTER TABLE `session_notes` ADD FOREIGN KEY (`coach_id`) REFERENCES `users` (`id`);

ALTER TABLE `session_notes` ADD FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

ALTER TABLE `organizations` ADD FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`);

ALTER TABLE `organization_members` ADD FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`);

ALTER TABLE `organization_members` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `wellness_campaigns` ADD FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`);

ALTER TABLE `wellness_campaigns` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `wellness_scores` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_analytics` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
