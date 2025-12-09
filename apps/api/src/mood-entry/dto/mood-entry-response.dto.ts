// mood-entry-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MoodEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  mood: string;

  @ApiProperty()
  intensity: number;

  @ApiProperty()
  emotions: string[];

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  energy: number;

  @ApiProperty()
  stress: number;

  @ApiProperty()
  anxiety: number;

  @ApiProperty()
  happiness: number;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  weatherCondition?: string;

  @ApiProperty()
  recordedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
