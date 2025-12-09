import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MoodEntryService } from './mood-entry.service';
import {
  CreateMoodEntryDto,
  UpdateMoodEntryDto,
  QueryMoodEntriesDto,
  MoodEntryResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Mood Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mood-entries')
export class MoodEntryController {
  constructor(private readonly moodEntryService: MoodEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mood entry' })
  @ApiResponse({
    status: 201,
    description: 'Mood entry created successfully',
    type: MoodEntryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body() createMoodEntryDto: CreateMoodEntryDto,
  ): Promise<MoodEntryResponseDto> {
    return this.moodEntryService.create(req.user.id, createMoodEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mood entries for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of mood entries retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req, @Query() query: QueryMoodEntriesDto) {
    return this.moodEntryService.findAll(req.user.id, query);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent mood entries (last 7 days)' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to look back',
    example: 7,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent mood entries retrieved successfully',
  })
  async getRecent(@Request() req, @Query('days') days?: number) {
    return this.moodEntryService.getRecentEntries(
      req.user.id,
      days ? parseInt(days.toString()) : 7,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get mood statistics for the current user' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to analyze',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Mood statistics retrieved successfully',
  })
  async getStatistics(@Request() req, @Query('days') days?: number) {
    return this.moodEntryService.getStatistics(
      req.user.id,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific mood entry by ID' })
  @ApiResponse({
    status: 200,
    description: 'Mood entry retrieved successfully',
    type: MoodEntryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mood entry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<MoodEntryResponseDto> {
    return this.moodEntryService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mood entry' })
  @ApiResponse({
    status: 200,
    description: 'Mood entry updated successfully',
    type: MoodEntryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mood entry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMoodEntryDto: UpdateMoodEntryDto,
  ): Promise<MoodEntryResponseDto> {
    return this.moodEntryService.update(req.user.id, id, updateMoodEntryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a mood entry' })
  @ApiResponse({ status: 204, description: 'Mood entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Mood entry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.moodEntryService.remove(req.user.id, id);
  }
}