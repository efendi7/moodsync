import {
  Body,
  Controller,
  Post,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);

    // Tambahkan pengecekan user
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Get('login')
  getLogin() {
    return {
      message:
        'Halaman login belum dibuat, ini response default dari GET /auth/login',
    };
  }
}
