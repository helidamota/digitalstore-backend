const mysql = require('mysql2/promise');
const config = require('./config/database');

async function waitForDatabase() {
    const maxRetries = 30;
    const retryInterval = 2000;
    const host = process.env.DB_HOST || config.database.host;

    console.log(`Waiting for database at ${host}:${config.database.port}...`);

    for (let i = 0; i < maxRetries; i++) {
        try {
            const connection = await mysql.createConnection({
                host: host,
                port: config.database.port,
                user: config.database.user,
                password: config.database.password,
            });
            await connection.ping();
            await connection.end();
            console.log('Database is ready!');
            return true;
        } catch (error) {
            console.log(`Waiting for database... (${i + 1}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
    }

    throw new Error('Database connection failed after multiple retries');
}

module.exports = waitForDatabase;
