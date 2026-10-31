require('dotenv').config();
const app = require('./app');
const config = require('./config/database');
const sequelize = require('./models/index');

const port = config.app.port;

// Sync database and start server
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Environment: ${config.app.env}`);
    });
});

module.exports = app;
