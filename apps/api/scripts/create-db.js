const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

async function createDatabase() {
    // Prioritaskan variabel Railway (tanpa UNDERSCORE) jika ada, lalu fallback ke lokal
    const dbName = process.env.MYSQLDATABASE || process.env.DATABASE_NAME; 

    if (!dbName) {
        console.error("Error: DATABASE_NAME (or MYSQLDATABASE) is not set. Please configure your environment variables.");
        process.exit(1);
    }

    let host, port, user, password;

    // PERBAIKAN DI SINI: Gunakan variabel TANPA UNDERSCORE
    if (process.env.MYSQLHOST && process.env.MYSQLPORT && process.env.MYSQLUSER && process.env.MYSQLPASSWORD) {
        host = process.env.MYSQLHOST; 
        port = parseInt(process.env.MYSQLPORT);
        user = process.env.MYSQLUSER;
        password = process.env.MYSQLPASSWORD;
    } else if (process.env.MYSQL_URL) {
        // Fallback ke parsing MYSQL_URL jika variabel terpisah tidak ada
        try {
            const url = new URL(process.env.MYSQL_URL);
            host = url.hostname;
            port = parseInt(url.port) || 3306;
            user = url.username;
            password = url.password;
        } catch (e) {
            console.error("Error parsing MYSQL_URL:", e.message);
            process.exit(1);
        }
    } else {
        // Fallback ke variabel .env lokal jika tidak ada variabel Railway
        host = process.env.DATABASE_HOST || 'localhost';
        port = parseInt(process.env.DATABASE_PORT || '3306');
        user = process.env.DATABASE_USERNAME || 'root';
        password = process.env.DATABASE_PASSWORD || '';
    }

    if (!host || isNaN(port) || !user || password === undefined) { 
        console.error("Error: Database connection details (host, port, user, password) are incomplete.");
        console.error(`dbName: ${dbName}`);
        console.error(`host: ${host}`);
        console.error(`port: ${port} (type: ${typeof port}, isNaN: ${isNaN(port)})`);
        console.error(`user: ${user}`);
        console.error(`password provided: ${password !== undefined}`);
        process.exit(1);
    }

    let connection;
    try {
        console.log(`Attempting to connect to MySQL server at ${host}:${port} for database ${dbName}...`);
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
        if (connection) { 
            try { 
                await connection.end(); 
            } catch (closeError) { 
                console.error('Error closing connection:', closeError.message); 
            } 
        }
        process.exit(1);
    }
}

createDatabase();