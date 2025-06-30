import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path'; // Tambahkan import join

// Import semua entitas Anda di sini.
// Untuk skalabilitas, lebih baik menggunakan glob pattern (seperti yang dijelaskan di bawah)
// daripada mengimpor satu per satu jika jumlah entitas sudah banyak.
// Namun, jika masih sedikit, impor manual tetap jelas.
import { User } from '../users/entities/user.entity';
import { MoodEntry } from '../mood-entry/entities/mood-entry.entity';
import { UserProfile } from '../user-profile/entities/user-profile.entity';
import { Habit } from '../habits/entities/habit.entity';
// Tambahkan import untuk semua entitas lainnya
// import { DailyCheckin } from '../daily-checkins/entities/daily-checkin.entity';
// import { WellnessScore } from '../wellness-scores/entities/wellness-score.entity';
// ... dan seterusnya untuk 28 tabel Anda

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const nodeEnv = configService.get<string>('NODE_ENV');

    // Railway MySQL service menggunakan MYSQL* variables
    const mysqlUrl = configService.get<string>('MYSQL_URL'); // Internal connection
    const mysqlPublicUrl = configService.get<string>('MYSQL_PUBLIC_URL'); // External connection
    const host = configService.get<string>('MYSQLHOST');
    const port = parseInt(configService.get<string>('MYSQLPORT') || '3306');
    const username = configService.get<string>('MYSQLUSER');
    const password = configService.get<string>('MYSQLPASSWORD') || configService.get<string>('MYSQL_ROOT_PASSWORD');
    const database = configService.get<string>('MYSQLDATABASE') || configService.get<string>('MYSQL_DATABASE');

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
    console.log('Fallback DATABASE Variables (if Railway vars not found):');
    console.log('DATABASE_URL:', fallbackUrl ? '✓ Found' : '✗ Missing');
    console.log('DATABASE_HOST:', fallbackHost || 'Missing');
    console.log('================================');

    // Tunggu sebentar di production untuk memastikan database siap
    // Ini adalah heuristik. Pertimbangkan menggunakan mekanisme 'health check' yang lebih robust
    // atau 'startup probes' di lingkungan containerized (misal: Kubernetes)
    if (nodeEnv === 'production') {
      console.log('Production mode detected. Waiting 8 seconds for MySQL service to become ready...');
      await new Promise(resolve => setTimeout(resolve, 8000));
    }

    // Prioritas: MYSQL_PUBLIC_URL (external) > MYSQL_URL (internal) > DATABASE_URL > individual variables
    const connectionUrl = mysqlPublicUrl || mysqlUrl || fallbackUrl;
    const finalHost = host || fallbackHost;
    const finalPort = port || fallbackPort;
    const finalUsername = username || fallbackUsername;
    const finalPassword = password || fallbackPassword;
    const finalDatabase = database || fallbackDatabase;

    // Validasi bahwa semua variabel yang diperlukan ada
    if (!connectionUrl && (!finalHost || !finalUsername || !finalDatabase)) {
      const missing: string[] = [];
      if (!connectionUrl) missing.push('MYSQL_URL/DATABASE_URL');
      if (!finalHost) missing.push('MYSQLHOST/DATABASE_HOST');
      if (!finalUsername) missing.push('MYSQLUSER/DATABASE_USERNAME');
      if (!finalDatabase) missing.push('MYSQLDATABASE/DATABASE_NAME');

      console.error('Missing required environment variables for database connection:', missing.join(', '));
      throw new Error(`Missing required database configuration: ${missing.join(', ')}. Please check your .env file or Railway environment variables.`);
    }

    // Konfigurasi dasar TypeORM
    const baseConfig: any = {
      type: 'mysql' as const,
      entities: [
        // Menggunakan glob pattern untuk menemukan semua entitas secara otomatis.
        // Asumsi struktur folder entitas adalah src/*/entities/*.entity.ts
        join(__dirname, '..', '**', '*.entity.{ts,js}'),
        // Jika Anda ingin mengimpor secara manual untuk kontrol lebih,
        // hapus baris di atas dan gunakan array seperti ini:
        // User,
        // MoodEntry,
        // UserProfile,
        // Habit,
        // ... (semua entitas lainnya)
      ],
      
      // AUTO SYNC HANYA UNTUK DEVELOPMENT!
      // Gunakan migrasi untuk produksi (synchronize: false)
      synchronize: nodeEnv !== 'production', // true di dev, false di production
      autoLoadEntities: true, // TypeORM akan memuat entitas secara otomatis
      logging: nodeEnv === 'development' ? ['query', 'error', 'schema'] : ['error'], // 'schema' juga berguna di dev

      // Timeout settings yang cocok untuk lingkungan cloud seperti Railway
      connectTimeout: 20000, // 20 detik untuk koneksi awal
      acquireTimeout: 20000, // 20 detik untuk mendapatkan koneksi dari pool
      timeout: 20000, // 20 detik untuk operasi query
      retryAttempts: 6, // Lebih banyak percobaan ulang jika koneksi gagal
      retryDelay: 3000, // 3 detik antara setiap percobaan

      // Connection pool settings
      extra: {
        connectionLimit: 8, // Jumlah maksimum koneksi di pool (sesuaikan dengan kebutuhan dan kapasitas DB)
        idleTimeout: 600000, // 10 menit idle sebelum koneksi ditutup
        timezone: 'Z', // Gunakan 'Z' atau '+00:00' untuk UTC, pastikan konsisten
        
        // SSL settings untuk Railway (penting untuk production)
        ssl: nodeEnv === 'production' ? {
          rejectUnauthorized: false // Diperlukan untuk Railway, mereka menggunakan self-signed certs
        } : undefined,
        
        // MySQL connection flags yang aman
        flags: [
          'PROTOCOL_41',
          'TRANSACTIONS',
          'SECURE_CONNECTION',
          'MULTI_STATEMENTS'
        ],
        
        // Railway-specific optimizations & character set
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true,
      },
    };

    // Jika connection string tersedia, gunakan itu.
    if (connectionUrl) {
      console.log(`Using database connection string from: ${mysqlPublicUrl ? 'MYSQL_PUBLIC_URL' : (mysqlUrl ? 'MYSQL_URL' : 'DATABASE_URL')}`);
      return {
        ...baseConfig,
        url: connectionUrl,
      };
    }

    // Fallback ke individual environment variables
    console.log('Using individual environment variables for database connection.');
    console.log('Final connection details (individual vars):', {
      host: finalHost,
      port: finalPort,
      username: finalUsername,
      database: finalDatabase,
      hasPassword: !!finalPassword, // Hanya untuk debug, jangan log password sebenarnya
    });
    
    return {
      ...baseConfig,
      host: finalHost,
      port: finalPort,
      username: finalUsername,
      password: finalPassword || '', // Pastikan password tidak undefined
      database: finalDatabase,
    };
  },
};