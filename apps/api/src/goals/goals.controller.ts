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
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { GoalStatus } from './enums/goal-status.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: GoalStatus) {
    if (status) {
      return this.goalsService.findByStatus(req.user.userId, status);
    }
    return this.goalsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.goalsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, req.user.userId, updateGoalDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Request() req,
    @Param('id') id: string,
    @Body('currentValue') currentValue: number,
  ) {
    return this.goalsService.updateProgress(id, req.user.userId, currentValue);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.goalsService.remove(id, req.user.userId);
  }

  // ========== Milestone Endpoints ==========

  @Post(':goalId/milestones')
  createMilestone(
    @Request() req,
    @Param('goalId') goalId: string,
    @Body() createMilestoneDto: CreateMilestoneDto,
  ) {
    return this.goalsService.createMilestone(
      goalId,
      req.user.userId,
      createMilestoneDto,
    );
  }

  @Patch('milestones/:milestoneId/complete')
  completeMilestone(@Request() req, @Param('milestoneId') milestoneId: string) {
    return this.goalsService.completeMilestone(milestoneId, req.user.userId);
  }

  @Delete('milestones/:milestoneId')
  removeMilestone(@Request() req, @Param('milestoneId') milestoneId: string) {
    return this.goalsService.removeMilestone(milestoneId, req.user.userId);
  }
}
