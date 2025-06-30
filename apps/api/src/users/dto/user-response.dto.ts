// src/users/dto/user-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User, UserRole, SubscriptionPlan } from '../entities/user.entity';

@Exclude()
export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID pengguna (UUID)' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Email pengguna' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'moodsync_john', description: 'Username unik pengguna' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @Expose()
  full_name: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'URL avatar pengguna' })
  @Expose()
  avatar_url?: string;

  @ApiPropertyOptional({ example: 'https://lh3.googleusercontent.com/a/ABCDEF=s96-c', description: 'URL foto profil dari login OAuth (mis. Google)' })
  @Expose()
  profilePicture?: string;

  @ApiPropertyOptional({ example: '1234567890ABCDEF', description: 'ID dari penyedia OAuth (mis. Google ID)' })
  @Expose()
  googleId?: string;

  @ApiProperty({ example: 'personal', description: 'Peran pengguna' })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: 'free', description: 'Paket langganan pengguna' })
  @Expose()
  subscription_plan: SubscriptionPlan;

  @ApiPropertyOptional({ example: '2023-01-01T10:00:00.000Z', description: 'Timestamp verifikasi email' })
  @Expose({ name: 'email_verified_at' })
  email_verified_at?: Date;

  @ApiProperty({ example: true, description: 'Status penyelesaian onboarding' })
  @Expose({ name: 'onboarding_completed' })
  onboarding_completed: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Tanggal dibuat' })
  @Expose({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Tanggal diperbarui' })
  @Expose({ name: 'updated_at' })
  updated_at: Date;

  constructor(user: Partial<User>) {
    if (!user) {
      throw new Error('User data is required to create UserResponseDto.');
    }
    // Map all expected properties
    this.id = user.id!;
    this.email = user.email!;
    this.username = user.username!;
    this.full_name = user.full_name!;
    this.avatar_url = user.avatar_url;
    this.profilePicture = user.profilePicture;
    this.googleId = user.googleId;
    this.role = user.role!;
    this.subscription_plan = user.subscription_plan!;
    this.email_verified_at = user.email_verified_at;
    this.onboarding_completed = user.onboarding_completed!;
    this.created_at = user.created_at!;
    this.updated_at = user.updated_at!;
  }
}