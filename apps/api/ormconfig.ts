// ormconfig.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { URL } from 'url';

dotenv.config();

const getDatabaseConfig = (): DataSourceOptions => {
  let host, port, username, password, database;

  // 1. PRIORITAS TERTINGGI: Variabel lingkungan spesifik Railway (TANPA UNDERSCORE)
  if (process.env.MYSQLHOST && process.env.MYSQLPORT && process.env.MYSQLUSER && process.env.MYSQLPASSWORD && process.env.MYSQLDATABASE) {
    host = process.env.MYSQLHOST;
    port = parseInt(process.env.MYSQLPORT);
    username = process.env.MYSQLUSER;
    password = process.env.MYSQLPASSWORD;
    database = process.env.MYSQLDATABASE;
  } 
  // 2. KEDUA: Parsing MYSQL_URL jika tersedia (untuk kompatibilitas)
  else if (process.env.MYSQL_URL) {
    try {
      const url = new URL(process.env.MYSQL_URL);
      host = url.hostname;
      port = parseInt(url.port) || 3306;
      username = url.username;
      password = url.password;
      database = url.pathname.substring(1); 
      if (!database && process.env.MYSQLDATABASE) { 
        database = process.env.MYSQLDATABASE;
      }
    } catch (e) {
      console.error("Error parsing MYSQL_URL for TypeORM:", e.message);
      host = process.env.DATABASE_HOST || 'localhost';
      port = parseInt(process.env.DATABASE_PORT || '3306');
      username = process.env.DATABASE_USERNAME || 'root';
      password = process.env.DATABASE_PASSWORD || '';
      database = process.env.DATABASE_NAME || '';
    }
  } 
  // 3. TERAKHIR: Fallback ke variabel .env lokal
  else {
    host = process.env.DATABASE_HOST || 'localhost';
    port = parseInt(process.env.DATABASE_PORT || '3306');
    username = process.env.DATABASE_USERNAME || 'root';
    password = process.env.DATABASE_PASSWORD || '';
    database = process.env.DATABASE_NAME || '';
  }

  if (!host || isNaN(port) || !username || password === undefined || !database) {
    console.error("Error: Incomplete database configuration for TypeORM. Check your environment variables.");
    console.error(`Host: ${host}, Port: ${port}, User: ${username}, Password provided: ${password !== undefined}, Database: ${database}`);
    process.exit(1);
  }

  return {
    type: 'mysql',
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    
    entities: [join(__dirname, 'src', '**', '*.entity.{ts,js}')], 
    migrations: [join(__dirname, 'src', 'database', 'migrations', '*.{ts,js}')],
    
    logging: ['query', 'error', 'schema'], 
    synchronize: false, 

    extra: {
      connectionLimit: 8,
      timezone: 'Z',
      ssl: process.env.NODE_ENV === 'production' && process.env.RAILWAY_MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      flags: [
        'PROTOCOL_41', 'TRANSACTIONS', 'SECURE_CONNECTION', 'MULTI_STATEMENTS'
      ],
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
  };
};

const dataSource = new DataSource(getDatabaseConfig());
export default dataSource;