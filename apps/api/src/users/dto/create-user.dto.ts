import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @IsNotEmpty({ message: 'Nama harus diisi.' })
  @IsString({ message: 'Nama harus berupa string.' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email pengguna' })
  @IsEmail({}, { message: 'Email tidak valid.' })
  @IsNotEmpty({ message: 'Email harus diisi.' })
  email: string;

  @ApiProperty({ example: 'hashedPassword123', description: 'Password yang sudah di-hash' })
  @IsNotEmpty({ message: 'Password harus diisi.' })
  @IsString({ message: 'Password harus berupa string.' })
  password: string; // Sudah dalam bentuk hash dari AuthService
}
