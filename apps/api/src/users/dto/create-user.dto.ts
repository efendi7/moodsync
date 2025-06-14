import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @IsNotEmpty({ message: 'Nama harus diisi.' })
  @IsString({ message: 'Nama harus berupa string.' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email pengguna' })
  @IsEmail({}, { message: 'Email tidak valid.' })
  @IsNotEmpty({ message: 'Email harus diisi.' })
  email: string;

  @ApiPropertyOptional({ 
    example: 'hashedPassword123', 
    description: 'Password yang sudah di-hash (opsional untuk Google OAuth)' 
  })
  @IsOptional()
  @IsString({ message: 'Password harus berupa string.' })
  password?: string; // Optional untuk Google OAuth users

  @ApiPropertyOptional({ 
    example: '1234567890', 
    description: 'Google ID untuk OAuth users' 
  })
  @IsOptional()
  @IsString({ message: 'Google ID harus berupa string.' })
  googleId?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/avatar.jpg', 
    description: 'URL foto profil pengguna' 
  })
  @IsOptional()
  @IsString({ message: 'Profile picture harus berupa string.' })
  profilePicture?: string;
}
