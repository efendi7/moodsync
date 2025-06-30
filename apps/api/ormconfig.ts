// ormconfig.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config(); // Pastikan dotenv.config() dipanggil di sini juga

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME, // --- PERUBAHAN DI SINI: Langsung pakai DATABASE_NAME
  
  url: process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, // Pastikan URL juga konsisten
  
  entities: [join(__dirname, 'src', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'src', 'database', 'migrations', '*.{ts,js}')],
  
  synchronize: false,
  logging: ['query', 'error', 'schema'],
  
  extra: {
    connectionLimit: 8,
    idleTimeout: 600000,
    timezone: 'Z',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    flags: [
      'PROTOCOL_41', 'TRANSACTIONS', 'SECURE_CONNECTION', 'MULTI_STATEMENTS'
    ],
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;