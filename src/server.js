require('dotenv').config();
const app = require('./app');
const config = require('./config/database');
const { sequelize } = require('./models/index');
const waitForDatabase = require('./wait-for-db');

const port = config.app.port;

// Wait for database and start server
async function startServer() {
    try {
        await waitForDatabase();
        await sequelize.authenticate();
        console.log('Database connection established');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`Environment: ${config.app.env}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
