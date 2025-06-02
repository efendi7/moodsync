import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateMoodEntryDto {
  @IsString()
  emotion: string;

  @IsInt()
  intensity: number;

  @IsOptional()
  @IsArray()
  contextTags?: string[];

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  voiceNoteUrl?: string;

  @IsDateString()
  loggedAt: string;
}
