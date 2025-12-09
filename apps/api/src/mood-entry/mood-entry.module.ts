import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntryService } from './mood-entry.service';
import { MoodEntryController } from './mood-entry.controller';
import { MoodEntry } from './entities/mood-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoodEntry])],
  controllers: [MoodEntryController],
  providers: [MoodEntryService],
  exports: [MoodEntryService],
})
export class MoodEntryModule {}