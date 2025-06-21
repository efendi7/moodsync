import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { MoodEntry } from '../mood-entry/entities/mood-entry.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    // Try Railway's MySQL URL first, then fallback to DATABASE_URL
    const databaseUrl = configService.get<string>('MYSQL_URL') || 
                       configService.get<string>('DATABASE_URL');

    if (databaseUrl) {
      return {
        type: 'mysql',
        url: databaseUrl,
        entities: [User, MoodEntry],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        // Add connection timeout settings
        connectTimeout: 60000, // 60 seconds
        acquireTimeout: 60000,
        timeout: 60000,
        retryAttempts: 5,
        retryDelay: 3000,
        // Additional MySQL options for Railway
        extra: {
          connectionLimit: 10,
          acquireTimeout: 60000,
          timeout: 60000,
          reconnect: true,
        },
      };
    }

    // Fallback to individual environment variables
    // Use Railway's MySQL variables if available
    const host = configService.get<string>('MYSQLHOST') || 
                 configService.get<string>('DATABASE_HOST');
    const port = configService.get<number>('MYSQLPORT') || 
                 configService.get<number>('DATABASE_PORT') || 3306;
    const username = configService.get<string>('MYSQLUSER') || 
                     configService.get<string>('DATABASE_USERNAME');
    const password = configService.get<string>('MYSQLPASSWORD') || 
                     configService.get<string>('DATABASE_PASSWORD');
    const database = configService.get<string>('MYSQLDATABASE') || 
                     configService.get<string>('DATABASE_NAME');

    return {
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
      entities: [User, MoodEntry],
      synchronize: configService.get<string>('NODE_ENV') !== 'production',
      autoLoadEntities: true,
      // Connection timeout settings
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
      retryAttempts: 5,
      retryDelay: 3000,
      // Additional connection options
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
      },
    };
  },
};