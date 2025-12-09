import { PartialType } from '@nestjs/swagger';
import { CreateHabitDto } from './create-habit.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  @ApiPropertyOptional({ description: 'Is habit active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}