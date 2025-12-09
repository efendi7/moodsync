import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMoodEntryDto {
  @ApiProperty({
    description: 'Mood type (e.g., happy, sad, anxious)',
    example: 'happy',
  })
  @IsString()
  @IsNotEmpty()
  mood: string;

  @ApiProperty({
    description: 'Intensity level of the mood (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  intensity: number;

  @ApiPropertyOptional({
    description: 'Energy level (1-10)',
    example: 6,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  energy?: number;

  @ApiPropertyOptional({
    description: 'Stress level (1-10)',
    example: 4,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  stress?: number;

  @ApiPropertyOptional({
    description: 'Anxiety level (1-10)',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  anxiety?: number;

  @ApiPropertyOptional({
    description: 'Happiness level (1-10)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  happiness?: number;

  @ApiPropertyOptional({
    description: 'List of emotions felt',
    example: ['excited', 'grateful'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  emotions?: string[];

  @ApiPropertyOptional({
    description: 'Optional note about the mood',
    example: 'Had a great day at work!',
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({
    description: 'Context tags for the entry',
    example: ['work', 'exercise'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Location where mood was recorded',
    example: 'Office',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Weather condition at the time',
    example: 'sunny',
  })
  @IsString()
  @IsOptional()
  weatherCondition?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when mood was recorded',
    example: '2024-12-01T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  recordedAt?: string;
}
