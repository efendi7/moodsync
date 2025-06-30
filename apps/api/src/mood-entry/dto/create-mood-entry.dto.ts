// src/mood-entry/dto/create-mood-entry.dto.ts
import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMoodEntryDto {
  @ApiProperty({ example: 7, description: 'Skor mood (1-10)' })
  @IsInt()
  @Min(1)
  @Max(10)
  mood_score: number; // Sesuai dengan MoodEntry entity

  @ApiPropertyOptional({ example: 8, description: 'Level energi (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  energy_level?: number;

  @ApiPropertyOptional({ example: 3, description: 'Level kecemasan (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  anxiety_level?: number;

  @ApiPropertyOptional({ example: 4, description: 'Level stres (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  stress_level?: number;

  @ApiPropertyOptional({ example: 9, description: 'Level kebahagiaan (1-10)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  happiness_level?: number;

  @ApiPropertyOptional({ example: ['happy', 'calm'], description: 'Emosi terkait mood (array string)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mood_emotions?: string[];

  @ApiPropertyOptional({ example: 3, description: 'Intensitas mood (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  mood_intensity?: number;

  @ApiPropertyOptional({ example: ['work', 'meeting'], description: 'Tag konteks (array string)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  context_tags?: string[];

  @ApiPropertyOptional({ example: 'Jakarta, Indonesia', description: 'Lokasi mood dicatat' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'sunny', description: 'Kondisi cuaca' })
  @IsOptional()
  @IsString()
  weather_condition?: string;

  @ApiPropertyOptional({ example: 'Hari ini terasa produktif.', description: 'Catatan tambahan' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'https://example.com/mood-photo.jpg', description: 'URL foto mood' })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiPropertyOptional({ example: 'https://example.com/voice-note.mp3', description: 'URL voice note' })
  @IsOptional()
  @IsString()
  voice_note_url?: string;

  @ApiProperty({ example: '2023-01-01T14:30:00Z', description: 'Timestamp mood dicatat (ISO 8601)' })
  @IsDateString()
  loggedAt: string; // Akan dipetakan ke recorded_at di entity
}