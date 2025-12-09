import { PartialType } from '@nestjs/swagger';
import { CreateJournalDto } from './create-journal.dto';

export class UpdateJournalDto extends PartialType(CreateJournalDto) {}

// src/modules/journal/dto/query-journal.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryJournalDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'productive' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'gratitude' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;
}