import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { GoalStatus } from '../enums/goal-status.enum';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsOptional()
  targetValue?: number;

  @IsNumber()
  @IsOptional()
  currentValue?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;
}