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

// You would need to create this service and define its methods
// For demonstration, we'll just simulate it.
class JwtBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  async addToken(token: string, expirationTime: number): Promise<void> {
    // In a real application, you'd store this in a persistent store like Redis
    // and set an expiration for the token in the blacklist.
    this.blacklistedTokens.add(token);
    setTimeout(() => {
      this.blacklistedTokens.delete(token);
    }, expirationTime * 1000); // Convert seconds to milliseconds
    console.log(`Token added to blacklist. Current blacklist size: ${this.blacklistedTokens.size}`);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklistedTokens.has(token);
  }
}

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private readonly googleClientId: string;
  // Instantiate the blacklist service (in a real app, this would be injected)
  private readonly jwtBlacklistService: JwtBlacklistService;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is not defined in environment variables.');
      throw new Error('Google Client ID is not configured. Please check your .env file.');
    }
    this.googleClientId = clientId;
    this.googleClient = new OAuth2Client(this.googleClientId);
    this.jwtBlacklistService = new JwtBlacklistService(); // In a real app, inject this
  }

  // Validasi user saat login (untuk login dengan email/password lokal)
  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }
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
    const { confirmPassword, ...userDataToCreate } = data;

    return this.usersService.create({
      name: userDataToCreate.name,
      email: userDataToCreate.email,
      password: hashedPassword,
    });
  }

  async googleLogin(token: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();

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
        user = await this.usersService.create({
          name: name || 'Google User',
          email: email,
          googleId: googleId,
          profilePicture: profilePicture,
        });
      } else {
        if (user.password) {
          console.warn(`User with email ${email} already exists with a local password. Linking Google ID.`);
        }

        let needsUpdate = false;
        const updateData: any = {};

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
          const updatedUser = await this.usersService.findByEmail(email);
          if (updatedUser) {
            user = updatedUser;
          }
        }
      }

      if (!user) {
        throw new UnauthorizedException('Gagal memproses data user setelah Google login.');
      }

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
      if (error instanceof UnauthorizedException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException('Verifikasi token Google gagal atau terjadi kesalahan internal.');
    }
  }

  // --- NEW: Metode Logout ---
  async logout(token: string): Promise<{ message: string }> {
    try {
      // Decode the token to get its expiration time
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken || typeof decodedToken !== 'object' || !('exp' in decodedToken)) {
        throw new BadRequestException('Token tidak valid atau tidak memiliki waktu kedaluwarsa.');
      }

      const expirationTime = decodedToken.exp - Math.floor(Date.now() / 1000); // Remaining time in seconds

      if (expirationTime <= 0) {
        return { message: 'Token sudah kedaluwarsa, tidak perlu logout.' };
      }

      // Add the token to the blacklist
      await this.jwtBlacklistService.addToken(token, expirationTime);
      return { message: 'Berhasil logout, token telah diblacklist.' };
    } catch (error) {
      console.error('Error during logout:', error);
      throw new UnauthorizedException('Gagal logout.');
    }
  }
  // --- END NEW ---

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}