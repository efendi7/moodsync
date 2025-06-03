import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com', description: 'Email pengguna' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Kata sandi pengguna' })
  @IsNotEmpty()
  password: string;
}
