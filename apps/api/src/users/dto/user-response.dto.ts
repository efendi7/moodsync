import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID pengguna' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email pengguna' })
  email: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/avatar.jpg', 
    description: 'URL foto profil pengguna' 
  })
  profilePicture?: string;

  @ApiPropertyOptional({ 
    example: '1234567890', 
    description: 'Google ID jika user login via Google' 
  })
  googleId?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Tanggal dibuat' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Tanggal diperbarui' })
  updatedAt: Date;

  constructor(user: Partial<User>) {
    this.id = user.id!;
    this.name = user.name!;
    this.email = user.email!;
    this.profilePicture = user.profilePicture;
    this.googleId = user.googleId;
    this.createdAt = user.createdAt!;
    this.updatedAt = user.updatedAt!;
  }
}