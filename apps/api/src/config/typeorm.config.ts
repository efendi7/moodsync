// src/config/typeorm.config.ts ← ganti seluruh isi dengan ini

import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const isProd = configService.get<string>('NODE_ENV') === 'production';
    const isDev = !isProd;

    // === AMBIL SEMUA VARIABEL ===
    const railway = {
      host: configService.get<string>('MYSQLHOST'),
      port: configService.get<string>('MYSQLPORT'),
      user: configService.get<string>('MYSQLUSER'),
      password: configService.get<string>('MYSQLPASSWORD'),
      rootPassword: configService.get<string>('MYSQL_ROOT_PASSWORD'),
      database: configService.get<string>('MYSQLDATABASE'),
      url: configService.get<string>('MYSQL_URL'),
      publicUrl: configService.get<string>('MYSQL_PUBLIC_URL'),
    };

    const local = {
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<string>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
    };

    let host: string;
    let port: number;
    let username: string;
    let password: string;
    let database: string;
    let url: string | undefined;

    // 1. Railway individual vars (prioritas tertinggi)
    if (railway.host && railway.user && railway.database) {
      console.log('TypeORM: Using Railway individual environment variables');
      host = railway.host;
      port = Number(railway.port) || 3306;
      username = railway.user;
      password = railway.password || railway.rootPassword || '';
      database = railway.database;
    }
    // 2. Railway URL (public dulu, baru internal)
    else if (railway.publicUrl || railway.url) {
      url = railway.publicUrl || railway.url;
      console.log(`TypeORM: Using Railway URL → ${url!.replace(/:([^:@]+)@/, ':***@')}`);
      const parsed = new URL(url!);
      host = parsed.hostname;
      port = parsed.port ? Number(parsed.port) : 3306;
      username = decodeURIComponent(parsed.username || '');
      password = decodeURIComponent(parsed.password || '');
      database = parsed.pathname.slice(1);
    }
    // 3. Local .env
    else {
      console.log('TypeORM: Using local .env variables');
      host = local.host || 'localhost';
      port = Number(local.port) || 3306;
      username = local.username || 'root';
      password = local.password || '';
      database = local.database || 'moodsync';
    }

    // Validasi ketat
    if (!host || !username || database === undefined) {
      throw new Error(
        `TypeORM: Missing DB config! → host=${host}, user=${username}, db=${database}`,
      );
    }

    // Delay startup di Railway supaya MySQL sempat nyala
    if (isProd) {
      console.log('Production: Waiting 10s for MySQL to be ready...');
      await new Promise((r) => setTimeout(r, 10000));
    }

    return {
      type: 'mysql' as const,
      url, // kalau pakai URL, otomatis override host/port/etc
      host,
      port,
      username,
      password,
      database,

      // Auto-load semua entity (RECOMMENDED + aman)
      autoLoadEntities: true,

      // JANGAN import manual entity di sini → biar tree-shaking & HMR tetap jalan
      // entities: [User, MoodEntry, ...] ← HAPUS! Pakai autoLoadEntities aja

      migrations: [join(__dirname, '..', 'database/migrations/*.{ts,js}')],
      migrationsRun: isProd, // otomatis jalanin migration pas start di prod

      synchronize: isDev, // false di production → wajib!
      dropSchema: false,

      logging: isDev ? ['error', 'warn', 'info', 'query'] : ['error', 'warn'],

      // Logger cantik (opsional, tapi sangat direkomendasikan)
      // logger: 'advanced-console', // atau pakai typeorm-pretty-logger

      connectTimeout: 30000,
      acquireTimeout: 30000,

      extra: {
        charset: 'utf8mb4_unicode_ci',
        timezone: 'Z',
        connectionLimit: 10,
        ssl: isProd ? { rejectUnauthorized: false } : false,
      },

      // Biar migration CLI tetap jalan tanpa error
      cli: {
        migrationsDir: 'src/database/migrations',
      },
    };
  },
};