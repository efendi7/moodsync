import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pengguna' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Email pengguna' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Kata sandi minimal 6 karakter' })
  @MinLength(6)
  password: string;
}
