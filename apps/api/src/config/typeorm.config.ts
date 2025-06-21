import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { MoodEntry } from '../mood-entry/entities/mood-entry.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    // Railway MySQL service menggunakan MYSQL* variables
    const mysqlUrl = configService.get<string>('MYSQL_URL'); // Internal connection
    const mysqlPublicUrl = configService.get<string>('MYSQL_PUBLIC_URL'); // External connection
    const host = configService.get<string>('MYSQLHOST');
    const port = parseInt(configService.get<string>('MYSQLPORT') || '3306');
    const username = configService.get<string>('MYSQLUSER');
    const password = configService.get<string>('MYSQLPASSWORD') || configService.get<string>('MYSQL_ROOT_PASSWORD');
    const database = configService.get<string>('MYSQLDATABASE') || configService.get<string>('MYSQL_DATABASE');
    const nodeEnv = configService.get<string>('NODE_ENV');

    // Fallback ke DATABASE_* variables jika MYSQL* tidak ada (untuk compatibility)
    const fallbackUrl = configService.get<string>('DATABASE_URL');
    const fallbackHost = configService.get<string>('DATABASE_HOST');
    const fallbackPort = parseInt(configService.get<string>('DATABASE_PORT') || '3306');
    const fallbackUsername = configService.get<string>('DATABASE_USERNAME');
    const fallbackPassword = configService.get<string>('DATABASE_PASSWORD');
    const fallbackDatabase = configService.get<string>('DATABASE_NAME');

    // Debug logging - untuk memastikan variabel terdeteksi
    console.log('=== DATABASE CONNECTION DEBUG ===');
    console.log('NODE_ENV:', nodeEnv);
    console.log('Railway MySQL Variables:');
    console.log('MYSQL_URL:', mysqlUrl ? '✓ Found' : '✗ Missing');
    console.log('MYSQL_PUBLIC_URL:', mysqlPublicUrl ? '✓ Found' : '✗ Missing');
    console.log('MYSQLHOST:', host || 'Missing');
    console.log('MYSQLPORT:', port);
    console.log('MYSQLUSER:', username || 'Missing');
    console.log('MYSQLPASSWORD:', password ? '✓ Found' : '✗ Missing');
    console.log('MYSQLDATABASE:', database || 'Missing');
    console.log('---');
    console.log('Fallback DATABASE Variables:');
    console.log('DATABASE_URL:', fallbackUrl ? '✓ Found' : '✗ Missing');
    console.log('DATABASE_HOST:', fallbackHost || 'Missing');
    console.log('================================');

    // Tunggu sebentar di production untuk memastikan database siap
    if (nodeEnv === 'production') {
      console.log('Production mode: Waiting 8 seconds for MySQL service...');
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    // Prioritas: MYSQL_URL > DATABASE_URL > individual variables
    const connectionUrl = mysqlUrl || fallbackUrl;
    const finalHost = host || fallbackHost;
    const finalPort = port || fallbackPort;
    const finalUsername = username || fallbackUsername;
    const finalPassword = password || fallbackPassword;
    const finalDatabase = database || fallbackDatabase;

    // Gunakan connection string jika tersedia (lebih reliable)
    if (connectionUrl) {
      console.log(`Using connection string: ${mysqlUrl ? 'MYSQL_URL' : 'DATABASE_URL'}`);
      
      return {
        type: 'mysql' as const,
        url: connectionUrl,
        entities: [User, MoodEntry],
        synchronize: nodeEnv !== 'production', // Hanya sync di development
        autoLoadEntities: true,
        logging: nodeEnv === 'development' ? ['query', 'error'] : ['error'], // Log query di development
        
        // Timeout settings yang cocok untuk Railway
        connectTimeout: 20000, // 20 detik untuk Railway
        acquireTimeout: 20000,
        timeout: 20000,
        retryAttempts: 6, // Lebih banyak retry
        retryDelay: 3000, // 3 detik antara retry
        
        // Connection pool settings untuk Railway
        extra: {
          connectionLimit: 8, // Agak lebih besar untuk Railway
          idleTimeout: 600000, // 10 menit
          timezone: '+00:00',
          
          // SSL settings untuk Railway (penting!)
          ssl: nodeEnv === 'production' ? {
            rejectUnauthorized: false // Railway butuh ini
          } : undefined,
          
          // MySQL connection flags yang aman
          flags: [
            'PROTOCOL_41',
            'TRANSACTIONS',
            'SECURE_CONNECTION',
            'MULTI_STATEMENTS'
          ],
          
          // Railway-specific optimizations
          charset: 'utf8mb4',
          supportBigNumbers: true,
          bigNumberStrings: true
        },
      };
    }

    // Fallback ke individual environment variables
    console.log('Using individual environment variables');
    console.log('Final connection details:', {
      host: finalHost,
      port: finalPort,
      username: finalUsername,
      database: finalDatabase,
      hasPassword: !!finalPassword
    });
    
    // Validasi bahwa semua variabel yang diperlukan ada
    if (!finalHost || !finalUsername || !finalDatabase) {
      const missing: string[] = []; // Fix: explicitly type the array as string[]
      if (!finalHost) missing.push('MYSQLHOST/DATABASE_HOST');
      if (!finalUsername) missing.push('MYSQLUSER/DATABASE_USERNAME');
      if (!finalDatabase) missing.push('MYSQLDATABASE/DATABASE_NAME');
      
      console.error('Missing required environment variables:', missing.join(', '));
      throw new Error(`Missing required database configuration: ${missing.join(', ')}`);
    }

    return {
      type: 'mysql' as const,
      host: finalHost,
      port: finalPort,
      username: finalUsername,
      password: finalPassword || '', // Password bisa kosong untuk development
      database: finalDatabase,
      entities: [User, MoodEntry],
      synchronize: nodeEnv !== 'production',
      autoLoadEntities: true,
      logging: nodeEnv === 'development' ? ['query', 'error'] : ['error'],
      
      // Timeout settings
      connectTimeout: 20000,
      acquireTimeout: 20000,
      timeout: 20000,
      retryAttempts: 6,
      retryDelay: 3000,
      
      // Connection pool dan SSL settings
      extra: {
        connectionLimit: 8,
        idleTimeout: 600000,
        timezone: '+00:00',
        
        // SSL untuk production (Railway)
        ssl: nodeEnv === 'production' ? {
          rejectUnauthorized: false
        } : undefined,
        
        // MySQL flags dan optimizations
        flags: [
          'PROTOCOL_41',
          'TRANSACTIONS',
          'SECURE_CONNECTION',
          'MULTI_STATEMENTS'
        ],
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true
      },
    };
  },
};