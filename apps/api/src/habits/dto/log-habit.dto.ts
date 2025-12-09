import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogHabitDto {
  @ApiProperty({ description: 'Date of the log', example: '2024-01-15' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ description: 'Whether the habit was completed' })
  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;

  @ApiPropertyOptional({ description: 'Value achieved', example: 30 })
  @IsOptional()
  @IsNumber()
  valueAchieved?: number;

  @ApiPropertyOptional({ description: 'Notes for this log' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Mood before (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  moodBefore?: number;

  @ApiPropertyOptional({ description: 'Mood after (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  moodAfter?: number;
}