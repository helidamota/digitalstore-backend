const Sequelize = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: config.app.env === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
});

module.exports = sequelize;
