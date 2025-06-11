// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
  ValidateIf,
  Validate, // Import dekorator Validate
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchPasswordConstraint } from '../../common/validators/match-password.validator'; // Import custom validator Anda

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @IsNotEmpty({ message: 'Nama lengkap harus diisi.' })
  @IsString({ message: 'Nama harus berupa string.' })
  name: string;

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
  // Gunakan @Validate dengan custom validator Anda
  @Validate(MatchPasswordConstraint, ['password']) // Parameter kedua adalah nama properti yang akan dibandingkan
  confirmPassword: string;
}