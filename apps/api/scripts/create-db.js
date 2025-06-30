// apps/api/scripts/create-db.js (atau apps/api/create-db.js, sesuaikan lokasinya)
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Pastikan ini memuat .env dengan benar berdasarkan lokasi skrip.
// Jika script di apps/api/scripts/, maka '../.env' untuk menunjuk ke apps/api/.env
// Jika script di apps/api/, maka './.env'
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Contoh jika script di 'scripts' subfolder

async function createDatabase() {
    // --- PERUBAHAN DI SINI: Paksa penggunaan DATABASE_NAME dari .env ---
    const dbName = process.env.DATABASE_NAME; 

    if (!dbName) {
        console.error("Error: DATABASE_NAME is not set in your .env file or not loaded. Please set it (e.g., DATABASE_NAME=moodsync).");
        process.exit(1); // Keluar jika variabel tidak ada
    }
    // --- AKHIR PERUBAHAN ---

    const host = process.env.DATABASE_HOST || 'localhost';
    const port = parseInt(process.env.DATABASE_PORT || '3306');
    const user = process.env.DATABASE_USERNAME || 'root';
    const password = process.env.DATABASE_PASSWORD || '';

    let connection;
    try {
        console.log(`Attempting to connect to MySQL server at ${host}:${port}...`);
        connection = await mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
        });
        console.log('Successfully connected to MySQL server.');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' ensured to exist.`);
        
        await connection.end();
        console.log('Connection to MySQL server closed.');

    } catch (error) {
        console.error('Error creating database:', error.message);
        if (connection) { try { await connection.end(); } catch (closeError) { console.error('Error closing connection:', closeError.message); } }
        process.exit(1);
    }
}

createDatabase();