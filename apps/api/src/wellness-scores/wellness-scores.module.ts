import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WellnessScore } from './entities/wellness-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WellnessScore])],
  exports: [TypeOrmModule],
})
export class WellnessScoresModule {}