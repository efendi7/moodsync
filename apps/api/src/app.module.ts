// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis'; // No need for RedisModuleOptions import here, as it's handled internally
import { typeOrmConfigAsync } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ensure this is correct for your .env file location
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'single', // <-- Explicitly define the connection type
          // The 'single' property should contain the actual ioredis options
          single: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
            password: configService.get<string>('REDIS_PASSWORD'), // This can be undefined
            lazyConnect: true,
            // Add any other ioredis RedisOptions here if needed
            // e.g., db: 0, showFriendlyErrorStack: true,
          },
          // You might also need to specify a 'name' here,
          // though it's often optional for a single default connection.
          // name: 'default', // Uncomment if the above still doesn't work.
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
