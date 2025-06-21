import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtBlacklistService {
  private blacklist = new Map<string, number>(); // token -> expirationTime

  async addToken(token: string, expirationTime: number): Promise<void> {
    const expiryTimestamp = Math.floor(Date.now() / 1000) + expirationTime;
    this.blacklist.set(token, expiryTimestamp);
    console.log(`Token blacklisted (in memory): ${token.substring(0, 10)}...`);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const expiry = this.blacklist.get(token);
    const now = Math.floor(Date.now() / 1000);

    if (!expiry) return false;

    if (expiry < now) {
      this.blacklist.delete(token); // Clean up expired token
      return false;
    }

    return true;
  }
}
