import { IsString, IsOptional, IsInt, Min, Max, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJournalDto {
  @ApiPropertyOptional({ example: 'My Amazing Day' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Today was a productive day. I completed all my tasks...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  moodBefore?: number;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  moodAfter?: number;

  @ApiPropertyOptional({ example: ['gratitude', 'productivity', 'mindfulness'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}