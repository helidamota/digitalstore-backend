const AuthService = require('../services/AuthService');

class AuthController {
    // POST /v1/user/token - Gera token JWT
    static async token(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            if (typeof email !== 'string' || typeof password !== 'string') {
                return res.status(400).json({ message: 'Email and password must be strings' });
            }

            const token = await AuthService.generateToken(email, password);

            return res.status(200).json({ token });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = AuthController;
