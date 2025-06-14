import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe Updated', description: 'Nama lengkap pengguna' })
  @IsOptional()
  @IsString({ message: 'Nama harus berupa string.' })
  name?: string;

  @ApiPropertyOptional({ example: 'newemail@example.com', description: 'Email pengguna' })
  @IsOptional()
  @IsEmail({}, { message: 'Email tidak valid.' })
  email?: string;

  @ApiPropertyOptional({ 
    example: '1234567890', 
    description: 'Google ID untuk OAuth users' 
  })
  @IsOptional()
  @IsString({ message: 'Google ID harus berupa string.' })
  googleId?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/new-avatar.jpg', 
    description: 'URL foto profil pengguna' 
  })
  @IsOptional()
  @IsString({ message: 'Profile picture harus berupa string.' })
  profilePicture?: string;

  // Note: Password tidak disertakan di UpdateUserDto untuk keamanan
  // Gunakan ChangePasswordDto yang terpisah untuk mengubah password
}
