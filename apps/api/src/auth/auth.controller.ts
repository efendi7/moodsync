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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // grouping di Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user dengan email dan password' })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil dan mengembalikan token JWT',
    // schema: { example: { access_token: 'token_string' } }  // opsional contoh response
  })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrasi user baru' })
  @ApiResponse({
    status: 201,
    description: 'User berhasil dibuat',
    // schema: { example: { id: 1, email: 'user@mail.com', name: 'User' } }
  })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Get('login')
  @ApiOperation({ summary: 'Halaman login (dummy response untuk GET login)' })
  @ApiResponse({
    status: 200,
    description: 'Response default ketika mengakses GET /auth/login',
    schema: {
      example: {
        message:
          'Halaman login form sudah ada, silahkan cek di https://localhost:3000/auth/login',
      },
    },
  })
  getLogin() {
    return {
      message:
        'Halaman login form sudah ada, silahkan cek di https://localhost:3000/auth/login',
    };
  }

  @Get('register')
  @ApiOperation({
    summary: 'Halaman register (dummy response untuk GET register)',
  })
  @ApiResponse({
    status: 200,
    description: 'Response default ketika mengakses GET /auth/register',
    schema: {
      example: {
        message:
          'Halaman register form sudah ada, silahkan cek di https://localhost:3000/auth/register',
      },
    },
  })
  getRegister() {
    return {
      message:
        'Halaman register form sudah ada, silahkan cek di https://localhost:3000/auth/register',
    };
  }
}
