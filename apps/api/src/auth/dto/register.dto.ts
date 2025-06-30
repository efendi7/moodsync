// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
  ValidateIf,
  Validate,
  IsOptional, // <-- Tambahkan IsOptional
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // <-- Tambahkan ApiPropertyOptional
import { MatchPasswordConstraint } from '../../common/validators/match-password.validator';

export class RegisterDto {
  @ApiProperty({ example: 'moodsync_user', description: 'Username unik pengguna' })
  @IsNotEmpty({ message: 'Username harus diisi.' })
  @IsString({ message: 'Username harus berupa string.' })
  @MinLength(3, { message: 'Username minimal 3 karakter.' })
  username: string; // <-- Perubahan: Dari 'name' menjadi 'username'

  @ApiPropertyOptional({ example: 'John Doe', description: 'Nama lengkap pengguna (opsional)' })
  @IsOptional() // <-- Perubahan: Jadikan opsional
  @IsString({ message: 'Nama lengkap harus berupa string.' })
  full_name?: string; // <-- Perubahan: Dari 'name' menjadi 'full_name' dan opsional

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email pengguna',
  })
  @IsEmail({}, { message: 'Email tidak valid.' })
  @IsNotEmpty({ message: 'Email harus diisi.' })
  email: string;

  @ApiProperty({
    example: 'SecureP@ss1',
    description: 'Kata sandi (minimal 8 karakter, huruf besar, kecil, angka, spesial)',
  })
  @IsNotEmpty({ message: 'Password harus diisi.' })
  @MinLength(8, { message: 'Password minimal 8 karakter.' })
  @Matches(/[A-Z]/, { message: 'Password harus mengandung setidaknya satu huruf kapital (A-Z).' })
  @Matches(/[a-z]/, { message: 'Password harus mengandung setidaknya satu huruf kecil (a-z).' })
  @Matches(/\d/, { message: 'Password harus mengandung setidaknya satu angka (0-9).' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password harus mengandung setidaknya satu karakter spesial (!@#$%^&*(),.?":{}|<>).',
  })
  @IsString({ message: 'Password harus berupa string.' })
  password: string;

  @ApiProperty({
    example: 'SecureP@ss1',
    description: 'Konfirmasi kata sandi',
  })
  @IsNotEmpty({ message: 'Konfirmasi password harus diisi.' })
  @IsString({ message: 'Konfirmasi password harus berupa string.' })
  @ValidateIf((o) => o.password !== undefined && o.password !== null && o.password.length > 0)
  @Validate(MatchPasswordConstraint, ['password'], { message: 'Konfirmasi password tidak cocok dengan password.' }) // <-- Tambahkan pesan error untuk validator kustom
  confirmPassword: string;

  @ApiPropertyOptional({ description: 'URL avatar pengguna', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString({ message: 'URL avatar harus berupa string.' })
  avatar_url?: string; // <-- Tambahkan sesuai skema User

  @ApiPropertyOptional({ description: 'Zona waktu pengguna (misal: "Asia/Jakarta")', example: 'Asia/Jakarta' })
  @IsOptional()
  @IsString({ message: 'Zona waktu harus berupa string.' })
  timezone?: string; // <-- Tambahkan sesuai skema User

  @ApiPropertyOptional({ description: 'Bahasa pilihan pengguna (misal: "id-ID")', example: 'id-ID' })
  @IsOptional()
  @IsString({ message: 'Bahasa harus berupa string.' })
  language?: string; // <-- Tambahkan sesuai skema User
}