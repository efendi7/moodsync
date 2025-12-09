// src/daily-checkins/daily-checkins.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyCheckin } from './entities/daily-checkins.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyCheckin])],
  exports: [TypeOrmModule],
})
export class DailyCheckinsModule {}
