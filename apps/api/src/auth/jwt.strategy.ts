// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'your-secret-key';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    
    console.log('🔐 JwtStrategy initialized');
  }

  async validate(payload: any) {
    console.log('🔐 JwtStrategy.validate called with payload:', payload);
    
    if (!payload || !payload.sub) {
      console.error('❌ Invalid payload - missing sub');
      throw new UnauthorizedException('Invalid token payload');
    }

    // Find user to verify they still exist
    const user = await this.usersService.findByEmail(payload.email);
    
    if (!user) {
      console.error('❌ User not found:', payload.email);
      throw new UnauthorizedException('User not found');
    }

    console.log('✅ User validated:', user.email);

    // IMPORTANT: This object will be assigned to req.user
    const userPayload = {
      userId: payload.sub,
      id: payload.sub,
      sub: payload.sub,
      email: payload.email,
      username: user.username,
      role: user.role,
    };

    console.log('✅ Returning user payload:', userPayload);
    return userPayload;
  }
}