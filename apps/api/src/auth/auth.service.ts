// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Fix: Handle undefined GOOGLE_CLIENT_ID properly
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is not defined in environment variables.');
      throw new Error('Google Client ID is not configured. Please check your .env file.');
    }
    this.googleClientId = clientId;
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  // Validasi user saat login (untuk login dengan email/password lokal)
  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    // Jika user tidak ditemukan ATAU user ada tapi tidak punya password (social login)
    if (!user || !user.password) {
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
  async login(user: Omit<User, 'password'>): Promise<{ access_token: string; user: { id: number; email: string; name: string; profilePicture?: string } }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    };
  }

  // Registrasi user baru (dengan password lokal)
  async register(data: RegisterDto): Promise<any> {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await this.hashPassword(data.password);
    // Hapus confirmPassword dari objek data sebelum dikirim ke UserService
    const { confirmPassword, ...userDataToCreate } = data;

    return this.usersService.create({
      name: userDataToCreate.name,
      email: userDataToCreate.email,
      password: hashedPassword, // Simpan password yang sudah di-hash
      // googleId dan profilePicture akan undefined untuk user register lokal
    });
  }

  // --- FIXED: Metode untuk Login Google dengan proper type checking ---
  async googleLogin(token: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();
      
      // Fix: Check if payload exists before accessing its properties
      if (!payload) {
        throw new BadRequestException('Token Google tidak valid - payload kosong.');
      }

      const email = payload.email;
      const name = payload.name;
      const googleId = payload.sub;
      const profilePicture = payload.picture;

      if (!email) {
        throw new BadRequestException('Email tidak ditemukan di token Google.');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        // Jika user belum ada, buat user baru
        // Create new user for Google OAuth
        user = await this.usersService.create({
          name: name || 'Google User',
          email: email,
          // password is optional, so we don't set it for Google OAuth users
          googleId: googleId,
          profilePicture: profilePicture,
        });
      } else {
        // Jika user sudah ada, update informasi Google jika diperlukan
        if (user.password) {
          console.warn(`User with email ${email} already exists with a local password. Linking Google ID.`);
        }

        let needsUpdate = false;
        const updateData: any = {}; // Use any temporarily or create proper UpdateUserDto

        if (!user.googleId && googleId) {
          updateData.googleId = googleId;
          needsUpdate = true;
        }
        if (user.name !== name && name) {
          updateData.name = name;
          needsUpdate = true;
        }
        if (user.profilePicture !== profilePicture && profilePicture) {
          updateData.profilePicture = profilePicture;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await this.usersService.update(user.id, updateData);
          
          // Fix: Use proper method to get updated user
          // If findById doesn't exist, use findByEmail again or implement findById
          const updatedUser = await this.usersService.findByEmail(email);
          if (updatedUser) {
            user = updatedUser;
          }
        }
      }

      // Fix: Add null check for user before accessing properties
      if (!user) {
        throw new UnauthorizedException('Gagal memproses data user setelah Google login.');
      }

      // Generate token aplikasi Anda sendiri untuk user yang login via Google
      const payloadJwt = { email: user.email, sub: user.id };
      return {
        message: 'Login dengan Google berhasil!',
        access_token: this.jwtService.sign(payloadJwt),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
        },
      };

    } catch (error) {
      console.error('Error verifying Google token or processing user:', error);
      // Untuk keamanan, berikan pesan error yang generik ke frontend
      if (error instanceof UnauthorizedException || error instanceof BadRequestException || error instanceof ConflictException) {
         throw error; // Lempar ulang jika itu adalah exception yang sudah spesifik
      }
      throw new UnauthorizedException('Verifikasi token Google gagal atau terjadi kesalahan internal.');
    }
  }

  // Fungsi private untuk hashing password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}