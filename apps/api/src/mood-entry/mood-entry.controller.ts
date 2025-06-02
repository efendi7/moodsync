import {
  Controller,
  Post,
  Get,
  Delete,
  Req,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoodEntryService } from './mood-entry.service';
import { CreateMoodEntryDto } from './dto/create-mood-entry.dto';


@UseGuards(JwtAuthGuard)
@Controller('moods')
export class MoodEntryController {
  constructor(private readonly moodService: MoodEntryService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateMoodEntryDto) {
    return this.moodService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.moodService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.moodService.remove(id, req.user.id);
  }
}
