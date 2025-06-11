import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123', description: 'Password saat ini' })
  @IsNotEmpty({ message: 'Password saat ini harus diisi.' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecureP@ss1', description: 'Password baru' })
  @IsNotEmpty({ message: 'Password baru harus diisi.' })
  @MinLength(8, { message: 'Password minimal 8 karakter.' })
  @Matches(/[A-Z]/, { message: 'Password harus mengandung huruf kapital.' })
  @Matches(/[a-z]/, { message: 'Password harus mengandung huruf kecil.' })
  @Matches(/\d/, { message: 'Password harus mengandung angka.' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password harus mengandung karakter spesial.' })
  newPassword: string;
}