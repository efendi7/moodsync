import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { MoodEntry } from '../mood-entry/entities/mood-entry.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    // Railway MySQL environment variables
    const host = configService.get<string>('MYSQLHOST');
    const port = parseInt(configService.get<string>('MYSQLPORT') || '3306');
    const username = configService.get<string>('MYSQLUSER');
    const password = configService.get<string>('MYSQLPASSWORD');
    const database = configService.get<string>('MYSQLDATABASE');

    // Fallback to generic DATABASE_* variables if Railway variables not found
    const fallbackHost = configService.get<string>('DATABASE_HOST');
    const fallbackPort = parseInt(configService.get<string>('DATABASE_PORT') || '3306');
    const fallbackUsername = configService.get<string>('DATABASE_USERNAME');
    const fallbackPassword = configService.get<string>('DATABASE_PASSWORD');
    const fallbackDatabase = configService.get<string>('DATABASE_NAME');

    // Use Railway variables first, then fallback
    const dbConfig = {
      host: host || fallbackHost,
      port: port || fallbackPort,
      username: username || fallbackUsername,
      password: password || fallbackPassword,
      database: database || fallbackDatabase,
    };

    // Check if we have Railway's MYSQL_URL (connection string)
    const mysqlUrl = configService.get<string>('MYSQL_URL');
    
    if (mysqlUrl) {
      return {
        type: 'mysql' as const,
        url: mysqlUrl,
        entities: [User, MoodEntry],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        // Critical: Railway MySQL connection settings
        connectTimeout: 20000, // Reduced from 60s to 20s
        acquireTimeout: 20000, // Time to acquire connection from pool
        timeout: 20000, // Query timeout
        retryAttempts: 3, // Reduced retry attempts
        retryDelay: 5000, // Increased delay between retries
        maxQueryExecutionTime: 30000, // Max time for query execution
        // Connection pool settings optimized for Railway
        extra: {
          connectionLimit: 5, // Reduced connection pool size
          acquireTimeout: 20000,
          timeout: 20000,
          reconnect: true,
          idleTimeout: 300000,
          timezone: '+00:00',
          // Railway-specific SSL settings
          ssl: {
            rejectUnauthorized: false
          },
          // Connection flags for better Railway compatibility
          flags: [
            'COMPRESS',
            'PROTOCOL_41',
            'TRANSACTIONS',
            'RESERVED',
            'SECURE_CONNECTION',
            'MULTI_STATEMENTS',
            'MULTI_RESULTS'
          ]
        },
      };
    }

    // Individual environment variables configuration
    return {
      type: 'mysql' as const,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [User, MoodEntry],
      synchronize: configService.get<string>('NODE_ENV') !== 'production',
      autoLoadEntities: true,
      // Connection timeout settings
      connectTimeout: 20000,
      acquireTimeout: 20000,
      timeout: 20000,
      retryAttempts: 3,
      retryDelay: 5000,
      maxQueryExecutionTime: 30000,
      // Connection pool and Railway-specific settings
      extra: {
        connectionLimit: 5,
        acquireTimeout: 20000,
        timeout: 20000,
        reconnect: true,
        idleTimeout: 300000,
        timezone: '+00:00',
        // SSL configuration for Railway
        ssl: {
          rejectUnauthorized: false
        },
        // MySQL connection flags
        flags: [
          'COMPRESS',
          'PROTOCOL_41', 
          'TRANSACTIONS',
          'RESERVED',
          'SECURE_CONNECTION',
          'MULTI_STATEMENTS',
          'MULTI_RESULTS'
        ]
      },
    };
  },
};