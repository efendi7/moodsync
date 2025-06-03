import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      // Kembalikan user tanpa password
      const { password, ...result } = user;
      return result;
    }
    // Jika gagal validasi, lempar UnauthorizedException
    throw new UnauthorizedException('Email atau password salah');
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

  // Registrasi user baru dengan validasi email unik dan hashing password
  async register(data: RegisterDto): Promise<any> {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await this.hashPassword(data.password);
    return this.usersService.create({
      name: data.name || 'Guest',
      email: data.email,
      password: hashedPassword,
    });
  }

  // Fungsi private untuk hashing password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
