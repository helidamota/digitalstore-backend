require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./models/index');
const config = require('./config/database');

async function runMigrations() {
    console.log('Starting migrations...');

    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync database
        await sequelize.sync();
        console.log('Database synchronized successfully.');

        // Load and run migrations
        const migrationsPath = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsPath).sort();

        console.log(`Found ${migrationFiles.length} migration files.`);

        // Check which migrations have already been run
        const [results] = await sequelize.query(
            "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'SequelizeMeta';",
            { replacements: [config.database.name] }
        );

        if (results[0].count === 0) {
            console.log('Creating SequelizeMeta table...');
            await sequelize.query(
                "CREATE TABLE IF NOT EXISTS SequelizeMeta (name VARCHAR(255) PRIMARY KEY);"
            );
        }

        // Get already executed migrations
        const [existingMigrations] = await sequelize.query('SELECT name FROM SequelizeMeta;');
        const executedMigrations = existingMigrations.map((m) => m.name);

        // Run pending migrations
        for (const file of migrationFiles) {
            if (executedMigrations.includes(file)) {
                console.log(`Skipping ${file} - already executed.`);
                continue;
            }

            console.log(`Running migration: ${file}`);
            const migration = require(path.join(migrationsPath, file));

            if (migration.up) {
                await migration.up(sequelize.getQueryInterface());
                await sequelize.query(`INSERT INTO SequelizeMeta (name) VALUES ('${file}');`);
                console.log(`Migration ${file} completed successfully.`);
            }
        }

        console.log('All migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

runMigrations();
