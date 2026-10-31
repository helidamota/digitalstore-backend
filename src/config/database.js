require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    database: {
        host: process.env.DB_HOST || 'host.docker.internal',
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME || 'digitalstore',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'rootpassword',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    swagger: {
        path: process.env.SWAGGER_PATH || '/api-docs',
    },
};

module.exports = config;
