const { Router } = require('express');
const UserController = require('../controllers/UserController');
const validateToken = require('../middleware/validateToken');

const userRoutes = Router();

// GET /api/users - Lista todos os usuários (sem autenticação)
userRoutes.get('/', UserController.index);

// GET /api/users/:id - Lista um usuário específico (sem autenticação)
userRoutes.get('/:id', UserController.show);

// POST /api/users - Cria um novo usuário (sem autenticação)
userRoutes.post('/', UserController.store);

// PUT /api/users/:id - Atualiza um usuário (requer token)
userRoutes.put('/:id', validateToken, UserController.update);

// DELETE /api/users/:id - Deleta um usuário (requer token)
userRoutes.delete('/:id', validateToken, UserController.destroy);

module.exports = userRoutes;
