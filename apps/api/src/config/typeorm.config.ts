import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { URL } from 'url'; // Penting untuk parsing URL


// Import semua entitas Anda di sini.
// Atau andalkan glob pattern di bawah. Jika Anda mengimpor manual,
// pastikan baris join(__dirname, '..', '**', '*.entity.{ts,js}') dihapus.
import { User } from '../users/entities/user.entity';
import { MoodEntry } from '../mood-entry/entities/mood-entry.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { Habit } from '../habits/entities/habit.entity';
// Tambahkan import untuk semua entitas lainnya jika tidak pakai glob
// import { DailyCheckin } from '../daily-checkins/entities/daily-checkin.entity';
// import { WellnessScore } from '../wellness-scores/entities/wellness-score.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const nodeEnv = configService.get<string>('NODE_ENV');

    // Railway MySQL service variables (TANPA UNDERSCORE, berdasarkan screenshot Anda)
    const railwayHost = configService.get<string>('MYSQLHOST');
    const railwayPort = parseInt(configService.get<string>('MYSQLPORT') || '3306');
    const railwayUser = configService.get<string>('MYSQLUSER');
    const railwayPassword = configService.get<string>('MYSQLPASSWORD'); // MYSQLPASSWORD
    const railwayRootPassword = configService.get<string>('MYSQL_ROOT_PASSWORD'); // MYSQL_ROOT_PASSWORD (ada underscore)
    const railwayDatabase = configService.get<string>('MYSQLDATABASE');
    const mysqlUrl = configService.get<string>('MYSQL_URL'); // URL internal Railway
    const mysqlPublicUrl = configService.get<string>('MYSQL_PUBLIC_URL'); // URL eksternal Railway

    // Fallback ke DATABASE_* variables (untuk lokal .env)
    const localHost = configService.get<string>('DATABASE_HOST');
    const localPort = parseInt(configService.get<string>('DATABASE_PORT') || '3306');
    const localUsername = configService.get<string>('DATABASE_USERNAME');
    const localPassword = configService.get<string>('DATABASE_PASSWORD');
    const localDatabase = configService.get<string>('DATABASE_NAME');

    // Debug logging
    console.log('=== TypeORM Config Debug ===');
    console.log('NODE_ENV:', nodeEnv);
    console.log('Railway Vars:', { railwayHost, railwayPort, railwayUser, hasRailwayPassword: !!railwayPassword, hasRailwayRootPassword: !!railwayRootPassword, railwayDatabase, mysqlUrl: !!mysqlUrl, mysqlPublicUrl: !!mysqlPublicUrl });
    console.log('Local Vars:', { localHost, localPort, localUsername, hasLocalPassword: !!localPassword, localDatabase });
    console.log('============================');

    // Tunggu sebentar di production untuk memastikan database siap (heuristik)
    if (nodeEnv === 'production') {
      console.log('Production mode detected. Waiting 8 seconds for MySQL service to become ready...');
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    let finalHost: string;
    let finalPort: number;
    let finalUsername: string;
    let finalPassword: string;
    let finalDatabase: string;
    let useUrlConnection: boolean = false;
    let finalUrl: string | undefined;

    // --- PRIORITAS PENGAMBILAN KONEKSI ---

    // 1. Prioritaskan variabel individu dari Railway (tanpa underscore)
    if (railwayHost && !isNaN(railwayPort) && railwayUser && (railwayPassword || railwayRootPassword) && railwayDatabase) {
      console.log('Using individual Railway environment variables.');
      finalHost = railwayHost;
      finalPort = railwayPort;
      finalUsername = railwayUser;
      finalPassword = railwayPassword || railwayRootPassword || ''; // Prioritaskan MYSQLPASSWORD, fallback ke ROOT_PASSWORD
      finalDatabase = railwayDatabase;
    } 
    // 2. Fallback ke MYSQL_URL atau MYSQL_PUBLIC_URL (jika Railway URL lengkap ada)
    else if (mysqlPublicUrl || mysqlUrl) {
      finalUrl = mysqlPublicUrl || mysqlUrl; // Prioritaskan public URL jika ada
      useUrlConnection = true;
      console.log(`Using database connection URL: ${finalUrl}`);
      try {
        const parsedUrl = new URL(finalUrl);
        finalHost = parsedUrl.hostname;
        finalPort = parseInt(parsedUrl.port) || 3306;
        finalUsername = parsedUrl.username;
        finalPassword = parsedUrl.password;
        finalDatabase = parsedUrl.pathname.substring(1); // Ambil nama DB dari path URL
      } catch (e) {
        console.error('Error parsing Railway URL. Falling back to local variables.', e);
        // Fallback jika parsing URL gagal
        finalHost = localHost || 'localhost';
        finalPort = localPort;
        finalUsername = localUsername || 'root';
        finalPassword = localPassword || '';
        finalDatabase = localDatabase || '';
        useUrlConnection = false; // Batalkan penggunaan URL jika parsing gagal
      }
    }
    // 3. Terakhir, fallback ke variabel lokal dari .env
    else {
      console.log('Using local environment variables.');
      finalHost = localHost || 'localhost';
      finalPort = localPort;
      finalUsername = localUsername || 'root';
      finalPassword = localPassword || '';
      finalDatabase = localDatabase || '';
    }

    // Validasi akhir
    if (!finalHost || isNaN(finalPort) || !finalUsername || finalPassword === undefined || !finalDatabase) {
      const missing: string[] = [];
      if (!finalHost) missing.push('Host');
      if (isNaN(finalPort)) missing.push('Port');
      if (!finalUsername) missing.push('Username');
      if (finalPassword === undefined) missing.push('Password');
      if (!finalDatabase) missing.push('Database Name');

      console.error('CRITICAL ERROR: Missing required environment variables for database connection:', missing.join(', '));
      throw new Error(`CRITICAL: Missing required database configuration: ${missing.join(', ')}. Check your .env file or Railway variables.`);
    }

    // Konfigurasi dasar TypeORM
    const baseConfig: any = {
      type: 'mysql',
      
      // Entitas: Menggunakan glob pattern yang lebih aman.
      // Jika ormconfig.ts ada di src/config, maka '..' naik satu level ke src/,
      // lalu cari di semua subfolder entitas.
      entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
      
      // Migrasi: Sesuaikan path ini jika berbeda
      // Contoh: src/database/migrations
      migrations: [join(__dirname, '..', 'database', 'migrations', '**', '*.{ts,js}')], 
      
      synchronize: nodeEnv !== 'production', // true di dev, false di production
      autoLoadEntities: true, // TypeORM akan memuat entitas secara otomatis
      logging: nodeEnv === 'development' ? ['query', 'error', 'schema'] : ['error'],

      connectTimeout: 20000,
      acquireTimeout: 20000,
      timeout: 20000,
      retryAttempts: 6,
      retryDelay: 3000,

      extra: {
        connectionLimit: 8,
        idleTimeout: 600000,
        timezone: 'Z',
        ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined, // Railway menggunakan self-signed
        flags: ['PROTOCOL_41', 'TRANSACTIONS', 'SECURE_CONNECTION', 'MULTI_STATEMENTS'],
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true,
      },
    };

    // Return konfigurasi TypeORM
    if (useUrlConnection && finalUrl) {
      return {
        ...baseConfig,
        url: finalUrl,
      };
    } else {
      return {
        ...baseConfig,
        host: finalHost,
        port: finalPort,
        username: finalUsername,
        password: finalPassword,
        database: finalDatabase,
      };
    }
  },
};