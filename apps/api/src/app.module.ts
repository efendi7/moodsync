// apps/api/src/app.module.ts

// Patch crypto.randomUUID() untuk Node.js < 14.17 (masih banyak dipakai di Railway/Render)
import { webcrypto } from 'crypto';
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config TypeORM (sudah kamu perbaiki sebelumnya)
import { typeOrmConfigAsync } from './config/typeorm.config';

// Controller & Service utama
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';

// Feature modules (tambahin satu per satu kalau sudah ada foldernya)
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoodEntryModule } from './mood-entry/mood-entry.module';
import { DailyCheckinsModule } from './daily-checkins/daily-checkins.module';        // BARU
import { HabitsModule } from './habits/habits.module';          
import { JournalModule } from './journal/journal.module';                    // kalau sudah ada
//import { UserProfileModule } from './user-profile/user-profile.module';              // kalau sudah ada
import { GoalsModule } from './goals/goals.module';
import { WellnessScoresModule } from './wellness-scores/wellness-scores.module';
// ... tambah yang lain nanti kalau sudah dibuat

@Module({
  imports: [
    // Config global + .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Koneksi database (sudah support Railway + local + autoLoadEntities)
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),

    // Feature modules (urutkan alfabet biar rapi)
    AuthModule,
    DailyCheckinsModule,        // PASTIKAN INI ADA — ini yang bikin error tadi hilang
    HabitsModule,
    MoodEntryModule,
    UsersModule,
    JournalModule,
    //UserProfileModule,
    GoalsModule,
    WellnessScoresModule,
    // ... module lain
  ],
  controllers: [
    AppController,
    HealthController,           // /health endpoint
  ],
  providers: [AppService],
})
export class AppModule {}