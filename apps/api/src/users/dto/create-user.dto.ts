// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUrl, IsBoolean, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, SubscriptionPlan } from '../entities/user.entity'; // Import enums

export class CreateUserDto {
  // Fix: Add username
  @ApiProperty({ description: 'Unique username for the user', example: 'moodsync_user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  // Fix: Use full_name instead of name
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user', required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email pengguna' })
  @IsEmail({}, { message: 'Email tidak valid.' })
  @IsNotEmpty({ message: 'Email harus diisi.' })
  email: string;

  // Fix: password_hash
  @ApiPropertyOptional({ example: 'hashedPassword123', description: 'Password yang sudah di-hash (opsional untuk Google OAuth)' })
  @IsOptional()
  @IsString({ message: 'Password hash harus berupa string.' })
  password_hash?: string; // Sesuai dengan password_hash di User entity

  @ApiPropertyOptional({ example: '1234567890', description: 'Google ID untuk OAuth users' })
  @IsOptional()
  @IsString({ message: 'Google ID harus berupa string.' })
  googleId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'URL foto profil pengguna' })
  @IsOptional()
  @IsString({ message: 'Profile picture harus berupa string.' })
  profilePicture?: string;

  // Add other properties from User entity with appropriate validators
  @ApiPropertyOptional({ description: 'URL avatar pengguna', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @ApiPropertyOptional({ description: 'Zona waktu pengguna (misal: "Asia/Jakarta")', example: 'Asia/Jakarta' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Bahasa pilihan pengguna (misal: "en-US")', example: 'en-US' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Peran pengguna', enum: UserRole, example: UserRole.PERSONAL })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Paket langganan pengguna', enum: SubscriptionPlan, example: SubscriptionPlan.FREE })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscription_plan?: SubscriptionPlan;

  @ApiPropertyOptional({ description: 'Timestamp verifikasi email', example: '2023-01-01T10:00:00.000Z' })
  @IsOptional()
  email_verified_at?: Date;

  @ApiPropertyOptional({ description: 'Status penyelesaian onboarding', example: false })
  @IsOptional()
  @IsBoolean()
  onboarding_completed?: boolean;

  @ApiPropertyOptional({ description: 'Pengaturan privasi (JSON)', example: {} })
  @IsOptional()
  privacy_settings?: Record<string, any>;
}