// src/auth/jwt-blacklist.service.ts
import { Injectable } from '@nestjs/common'; // Remove 'Inject' if not using a specific token
import { Redis } from 'ioredis'; // Import Redis type from 'ioredis' directly

@Injectable()
export class JwtBlacklistService {
  private readonly redisClient: Redis;

  // Inject the Redis client directly by type
  // The RedisModule usually makes the 'ioredis' client instance available directly.
  constructor(private readonly client: Redis) { // <--- CHANGED: Removed @Inject(REDIS_CLIENT)
    this.redisClient = client;
  }

  // Method to add token to blacklist with its expiry
  async addToken(token: string, expirationTime: number): Promise<void> {
    // Store in Redis with EX (expire) command to automatically remove after 'expirationTime' seconds
    await this.redisClient.setex(`blacklist:${token}`, expirationTime, 'true');
    console.log(`Token added to Redis blacklist: ${token.substring(0, 10)}...`);
  }

  // Method to check if a token is blacklisted
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const isBlacklisted = await this.redisClient.exists(`blacklist:${token}`);
    return isBlacklisted === 1; // 1 if key exists, 0 if not
  }
}