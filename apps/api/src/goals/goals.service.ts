import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { GoalMilestone } from './entities/goal-milestone.entity';
import { GoalStatus } from './enums/goal-status.enum';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { CreateMilestoneDto } from './dto/create-milestone.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(GoalMilestone)
    private readonly milestoneRepository: Repository<GoalMilestone>,
  ) {}

  // Create a new goal
  async create(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId,
    });
    return await this.goalRepository.save(goal);
  }

  // Get all goals for a user
  async findAllByUser(userId: string): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId },
      relations: ['milestones'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get goals by status
  async findByStatus(userId: string, status: GoalStatus): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId, status },
      relations: ['milestones'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get a single goal by ID
  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
      relations: ['milestones'],
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  // Update a goal
  async update(
    id: string,
    userId: string,
    updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    const goal = await this.findOne(id, userId);
    Object.assign(goal, updateGoalDto);
    return await this.goalRepository.save(goal);
  }

  // Update goal progress
  async updateProgress(
    id: string,
    userId: string,
    currentValue: number,
  ): Promise<Goal> {
    const goal = await this.findOne(id, userId);
    goal.currentValue = currentValue;

    // Auto-complete if target is reached
    if (goal.targetValue && currentValue >= goal.targetValue) {
      goal.status = GoalStatus.COMPLETED;
    }

    return await this.goalRepository.save(goal);
  }

  // Delete a goal
  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);
    await this.goalRepository.remove(goal);
  }

  // ========== Milestone Methods ==========

  // Create a milestone for a goal
  async createMilestone(
    goalId: string,
    userId: string,
    createMilestoneDto: CreateMilestoneDto,
  ): Promise<GoalMilestone> {
    // Verify goal exists and belongs to user
    await this.findOne(goalId, userId);

    const milestone = this.milestoneRepository.create({
      ...createMilestoneDto,
      goalId,
    });

    return await this.milestoneRepository.save(milestone);
  }

  // Complete a milestone
  async completeMilestone(
    milestoneId: string,
    userId: string,
  ): Promise<GoalMilestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId },
      relations: ['goal'],
    });

    if (!milestone || milestone.goal.userId !== userId) {
      throw new NotFoundException(`Milestone with ID ${milestoneId} not found`);
    }

    milestone.completedAt = new Date();
    return await this.milestoneRepository.save(milestone);
  }

  // Delete a milestone
  async removeMilestone(milestoneId: string, userId: string): Promise<void> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId },
      relations: ['goal'],
    });

    if (!milestone || milestone.goal.userId !== userId) {
      throw new NotFoundException(`Milestone with ID ${milestoneId} not found`);
    }

    await this.milestoneRepository.remove(milestone);
  }
}
