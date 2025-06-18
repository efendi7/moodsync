// src/auth/jwt-auth.guard.ts
import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtBlacklistService } from './jwt-blacklist.service'; // Import your blacklist service

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Inject JwtBlacklistService instead of JwtService directly
  // The AuthGuard('jwt') handles JwtService internally via JwtStrategy
  constructor(private jwtBlacklistService: JwtBlacklistService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided or invalid format');
    }

    const token = authorization.replace('Bearer ', '');

    // Step 1: Check if the token is blacklisted FIRST
    const isBlacklisted = await this.jwtBlacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been invalidated (logged out)');
    }

    // Step 2: Let the Passport JWT strategy validate the token's signature and expiration
    // This calls your JwtStrategy.validate() method
    const result = (await super.canActivate(context)) as boolean;

    // If super.canActivate() returns true, it means the token is valid AND
    // the JwtStrategy has successfully attached the user payload to request.user
    if (result) {
      return true;
    } else {
      // This case typically means Passport's strategy failed validation
      throw new UnauthorizedException('Invalid token');
    }
  }
}