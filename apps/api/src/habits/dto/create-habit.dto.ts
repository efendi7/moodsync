import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export class FrequencyValueDto {
  @ApiPropertyOptional({ description: 'Days of week for weekly habits', type: [Number] })
  @IsOptional()
  @IsNumber({}, { each: true })
  daysOfWeek?: number[];

  @ApiPropertyOptional({ description: 'Times per week' })
  @IsOptional()
  @IsNumber()
  timesPerWeek?: number;

  @ApiPropertyOptional({ description: 'Custom frequency pattern' })
  @IsOptional()
  @IsString()
  customPattern?: string;
}

export class CreateHabitDto {
  @ApiProperty({ description: 'Habit name', example: 'Morning Exercise' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Habit description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Habit category', example: 'health' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ enum: FrequencyType, description: 'Frequency type' })
  @IsEnum(FrequencyType)
  @IsNotEmpty()
  frequencyType: FrequencyType;

  @ApiPropertyOptional({ description: 'Frequency configuration' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FrequencyValueDto)
  frequencyValue?: FrequencyValueDto;

  @ApiProperty({ description: 'Difficulty level (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  difficultyLevel: number;

  @ApiPropertyOptional({ description: 'Target value', example: 30 })
  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', example: 'minutes' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Reminder time', example: '07:00:00' })
  @IsOptional()
  @IsString()
  reminderTime?: string;
}