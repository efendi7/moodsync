// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { User, UserRole, SubscriptionPlan } from '../users/entities/user.entity'; // Import UserRole dan SubscriptionPlan langsung
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Import CreateUserDto
// import { GoogleLoginDto } from './dto/google-login.dto'; // Import jika perlu

class JwtBlacklistService {
  private blacklistedTokens: Set<string> = new Set();
  async addToken(token: string, expiryTimeInSeconds: number): Promise<void> {
    if (expiryTimeInSeconds <= 0) {
      console.warn('Attempted to blacklist an already expired token. Skipping.');
      return;
    }
    this.blacklistedTokens.add(token);
    setTimeout(() => {
      this.blacklistedTokens.delete(token);
      console.log(`Token removed from blacklist after expiration.`);
    }, expiryTimeInSeconds * 1000);
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
    this.jwtBlacklistService = new JwtBlacklistService();
  }

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password_hash) { // Fix: use password_hash
      throw new UnauthorizedException('Email atau password salah');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password_hash); // Fix: use password_hash
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }
    const { password_hash, ...result } = user;
    return result;
  }

  async login(user: Omit<User, 'password_hash'>): Promise<{ access_token: string; user: UserResponseDto }> {
    const payload = { email: user.email, sub: user.id }; // Fix: user.id is string
    const accessToken = this.jwtService.sign(payload);
    const userResponse = new UserResponseDto(user); // Fix: Use user directly
    return {
      access_token: accessToken,
      user: userResponse,
    };
  }

  async register(data: RegisterDto): Promise<UserResponseDto> {
    const existingUserByEmail = await this.usersService.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }
    const existingUserByUsername = await this.usersService.findByUsername(data.username); // Fix: usersService.findByUsername exists now
    if (existingUserByUsername) {
      throw new ConflictException('Username sudah digunakan');
    }

    const hashedPassword = await this.hashPassword(data.password);

    // Fix: Ensure all properties of CreateUserDto are provided or are optional in DTO
    const createUserDto: CreateUserDto = {
      email: data.email,
      username: data.username, // Fix: username exists on RegisterDto
      password_hash: hashedPassword, // Fix: use password_hash
      full_name: data.full_name || data.username,
      avatar_url: data.avatar_url,
      timezone: data.timezone,
      language: data.language,
      role: UserRole.PERSONAL, // Fix: Access UserRole directly from import
      subscription_plan: SubscriptionPlan.FREE, // Fix: Access SubscriptionPlan directly from import
      onboarding_completed: false, // Default value
      privacy_settings: {}, // Default value
      email_verified_at: null, // Default value
    };

    const newUser = await this.usersService.create(createUserDto); // Fix: createUserDto type
    return new UserResponseDto(newUser);
  }

  async googleLogin(token: string): Promise<{ message: string; access_token: string; user: UserResponseDto }> {
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
      const full_name = payload.name; // Fix: use full_name
      const googleId = payload.sub;
      const profilePicture = payload.picture;

      if (!email) {
        throw new BadRequestException('Email tidak ditemukan di token Google.');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        const createGoogleUserDto: CreateUserDto = {
          email: email,
          username: email.split('@')[0] || googleId, // Fallback if email has no '@'
          full_name: full_name || 'Google User',
          googleId: googleId,
          profilePicture: profilePicture,
          password_hash: null, // Google login users don't have local password_hash
          role: UserRole.PERSONAL, // Fix: Access UserRole directly
          subscription_plan: SubscriptionPlan.FREE, // Fix: Access SubscriptionPlan directly
          onboarding_completed: false,
          privacy_settings: {},
          email_verified_at: new Date(),
        };
        user = await this.usersService.create(createGoogleUserDto); // Fix: createUserDto type
      } else {
        if (user.password_hash) { // Fix: Check password_hash
          console.warn(`User with email ${email} already exists with a local password. Linking Google ID.`);
        }

        let needsUpdate = false;
        const updateData: Partial<User> = {};

        if (!user.googleId && googleId) {
          updateData.googleId = googleId;
          needsUpdate = true;
        }
        if (user.full_name !== full_name && full_name) { // Fix: Check full_name
          updateData.full_name = full_name;
          needsUpdate = true;
        }
        if (user.profilePicture !== profilePicture && profilePicture) {
          updateData.profilePicture = profilePicture;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await this.usersService.update(user.id, updateData); // Fix: user.id is string
          const updatedUser = await this.usersService.findByEmail(email);
          if (updatedUser) {
            user = updatedUser;
          }
        }
      }

      if (!user) {
        throw new InternalServerErrorException('Gagal memproses data user setelah Google login.');
      }

      const payloadJwt = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payloadJwt);

      return {
        message: 'Login dengan Google berhasil!',
        access_token: accessToken,
        user: new UserResponseDto(user),
      };
    } catch (error) {
      console.error('Error verifying Google token or processing user:', error);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Verifikasi token Google gagal atau terjadi kesalahan internal.');
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken || typeof decodedToken !== 'object' || !('exp' in decodedToken)) {
        throw new BadRequestException('Token tidak valid atau tidak memiliki waktu kedaluwarsa.');
      }
      const expirationTime = decodedToken.exp - Math.floor(Date.now() / 1000);
      await this.jwtBlacklistService.addToken(token, expirationTime);
      return { message: 'Berhasil logout, token telah diblacklist.' };
    } catch (error) {
      console.error('Error during logout:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Gagal logout.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}