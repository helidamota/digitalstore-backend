const jwt = require('jsonwebtoken');
const config = require('../config/database');
const { User } = require('../models');

class AuthService {
    static async generateToken(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare password (password is already hashed in the database)
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        return token;
    }

    static async validateToken(token) {
        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

module.exports = AuthService;
