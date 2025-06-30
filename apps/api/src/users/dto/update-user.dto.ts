// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, IsUrl, IsBoolean, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, SubscriptionPlan } from '../entities/user.entity'; // Import enums jika digunakan secara langsung
import { CreateUserDto } from './create-user.dto'; // <-- PENTING: Import CreateUserDto

// UpdateUserDto sekarang akan mewarisi semua properti dari CreateUserDto,
// dan menjadikannya opsional. Ini adalah cara yang benar.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Tidak perlu menambahkan properti lagi di sini kecuali ada yang spesifik untuk update
  // dan tidak ada di CreateUserDto.
}