// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException, // Tambahkan ini untuk error validasi
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validasi user saat login
  async validateUser(email: string, pass: string): Promise<Omit<any, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) { // Tambahkan cek !user atau !user.password
        throw new UnauthorizedException('Email atau password salah');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Email atau password salah');
    }
    // Kembalikan user tanpa password
    const { password, ...result } = user;
    return result;
  }

  // Generate token JWT dan kembalikan data user yang diperlukan
  async login(user: any): Promise<{ access_token: string; user: { id: number; email: string; name: string } }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Registrasi user baru
  async register(data: RegisterDto): Promise<any> {
    // Validasi email unik sudah ada di sini, itu bagus!
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Tidak perlu validasi password/confirmPassword manual di sini
    // karena sudah ditangani oleh DTO dan Validation Pipe.

    const hashedPassword = await this.hashPassword(data.password);

    // Hapus confirmPassword dari objek data sebelum dikirim ke UserService
    const { confirmPassword, ...userDataToCreate } = data;

    return this.usersService.create({
      name: userDataToCreate.name || 'Guest', // Pastikan Anda tidak menyimpan 'Guest' jika nama diisi
      email: userDataToCreate.email,
      password: hashedPassword,
    });
  }

  // Fungsi private untuk hashing password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}