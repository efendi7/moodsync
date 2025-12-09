import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { LogHabitDto } from './dto/log-habit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('habits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  async create(@Request() req, @Body() createHabitDto: CreateHabitDto) {
    const habit = await this.habitsService.create(req.user.id, createHabitDto);
    return {
      success: true,
      data: habit,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Request() req,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const habits = await this.habitsService.findAll(req.user.id, {
      category,
      isActive: isActive ? isActive === 'true' : undefined,
    });

    return {
      success: true,
      data: habits,
      total: habits.length,
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get habit statistics' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getStatistics(@Request() req, @Query('days') days?: string) {
    const stats = await this.habitsService.getStatistics(
      req.user.id,
      days ? parseInt(days) : 30,
    );

    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    const habit = await this.habitsService.findOne(id, req.user.id);
    return {
      success: true,
      data: habit,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    const habit = await this.habitsService.update(id, req.user.id, updateHabitDto);
    return {
      success: true,
      data: habit,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a habit' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.habitsService.remove(id, req.user.id);
  }

  // ──────────────── HABIT LOGS ────────────────

  @Post(':id/logs')
  @ApiOperation({ summary: 'Log a habit completion' })
  async logHabit(
    @Param('id') id: string,
    @Request() req,
    @Body() logHabitDto: LogHabitDto,
  ) {
    const log = await this.habitsService.logHabit(id, req.user.id, logHabitDto);
    return {
      success: true,
      data: log,
    };
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get habit logs' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getHabitLogs(
    @Param('id') id: string,
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const logs = await this.habitsService.getHabitLogs(
      id,
      req.user.id,
      startDate,
      endDate,
    );

    return {
      success: true,
      data: logs,
      total: logs.length,
    };
  }

  @Patch('logs/:logId')
  @ApiOperation({ summary: 'Update a habit log' })
  async updateLog(
    @Param('logId') logId: string,
    @Request() req,
    @Body() logHabitDto: Partial<LogHabitDto>,
  ) {
    const log = await this.habitsService.updateLog(logId, req.user.id, logHabitDto);
    return {
      success: true,
      data: log,
    };
  }

  @Delete('logs/:logId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a habit log' })
  async deleteLog(@Param('logId') logId: string, @Request() req) {
    await this.habitsService.deleteLog(logId, req.user.id);
  }
}
