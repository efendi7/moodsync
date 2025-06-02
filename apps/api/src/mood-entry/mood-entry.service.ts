import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(userId: string, dto: CreateMoodEntryDto) {
    const entry = this.moodRepo.create({
      ...dto,
      user: { id: Number(userId) }, // ✅ convert string to number
    });
    return this.moodRepo.save(entry);
  }

  async findAll(userId: string) {
    return this.moodRepo.find({
      where: { user: { id: Number(userId) } }, // ✅ convert
      order: { loggedAt: 'DESC' },
    });
  }

  async remove(id: string, userId: number) {
    const entry = await this.moodRepo.findOne({
      where: {
        id, // ✅ langsung string (UUID)
        user: { id: userId }, // ✅ number
      },
    });
    if (!entry) throw new NotFoundException();
    return this.moodRepo.remove(entry);
  }
}
