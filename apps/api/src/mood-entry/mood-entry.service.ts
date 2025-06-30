// src/mood-entry/mood-entry.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'; // Import NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import { CreateMoodEntryDto } from './dto/create-mood-entry.dto';

@Injectable()
export class MoodEntryService {
  constructor(
    @InjectRepository(MoodEntry)
    private moodRepo: Repository<MoodEntry>,
  ) {}

  async create(userId: string, dto: CreateMoodEntryDto): Promise<MoodEntry> { // Fix: userId is string, return MoodEntry
    const entry = this.moodRepo.create({
      ...dto,
      user: { id: userId }, // Fix: id is string, no Number() conversion needed
      recorded_at: new Date(dto.loggedAt), // Use the loggedAt from DTO for recorded_at in entity
    });
    return this.moodRepo.save(entry);
  }

  async findAll(userId: string): Promise<MoodEntry[]> { // Fix: userId is string
    return this.moodRepo.find({
      where: { user: { id: userId } }, // Fix: id is string
      order: { recorded_at: 'DESC' }, // Fix: use recorded_at, not loggedAt
    });
  }

  async remove(id: string, userId: string): Promise<MoodEntry> { // Fix: id and userId are strings, return MoodEntry
    const entry = await this.moodRepo.findOne({
      where: {
        id,
        user: { id: userId }, // Fix: id is string
      },
    });
    if (!entry) throw new NotFoundException('Mood entry not found'); // Fix: throw NotFoundException
    return this.moodRepo.remove(entry);
  }
}