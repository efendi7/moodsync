// src/auth/jwt-auth.guard.ts
import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
    console.log('🔐 JwtAuthGuard initialized');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('🔐 JwtAuthGuard.canActivate called');
    
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    console.log('  Authorization header:', authorization ? 'Present' : 'Missing');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.error('❌ No token provided or invalid format');
      throw new UnauthorizedException('No token provided or invalid format');
    }

    const token = authorization.replace('Bearer ', '');
    console.log('  Token preview:', token.substring(0, 20) + '...');

    try {
      // Call parent canActivate which triggers JwtStrategy.validate()
      const result = (await super.canActivate(context)) as boolean;
      
      if (result) {
        console.log('✅ Token validated successfully');
        console.log('  req.user:', request.user);
        return true;
      }
      
      console.error('❌ Token validation failed');
      throw new UnauthorizedException('Invalid token');
      
    } catch (error) {
      console.error('❌ Guard error:', error.message);
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔐 JwtAuthGuard.handleRequest called');
    console.log('  err:', err);
    console.log('  user:', user);
    console.log('  info:', info);

    if (err || !user) {
      console.error('❌ Authentication failed in handleRequest');
      throw err || new UnauthorizedException('Authentication failed');
    }

    console.log('✅ handleRequest successful, returning user:', user);
    return user;
  }
}