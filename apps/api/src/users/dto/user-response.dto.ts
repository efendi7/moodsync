import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID pengguna' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email pengguna' })
  @Expose()
  email: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Tanggal dibuat' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Tanggal diupdate' })
  @Expose()
  updatedAt?: Date;

  // Exclude password from response
  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}