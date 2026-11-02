const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const authRoutes = Router();

// POST /v1/user/token - Gera token JWT
authRoutes.post('/token', AuthController.token);

module.exports = authRoutes;
