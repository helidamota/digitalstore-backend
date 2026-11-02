const { Router } = require('express');
const UserController = require('../controllers/UserController');

const userRoutes = Router();

// GET /api/users - Lista todos os usuários
userRoutes.get('/', UserController.index);

// GET /api/users/:id - Lista um usuário específico
userRoutes.get('/:id', UserController.show);

// POST /api/users - Cria um novo usuário
userRoutes.post('/', UserController.store);

// PUT /api/users/:id - Atualiza um usuário
userRoutes.put('/:id', UserController.update);

// DELETE /api/users/:id - Deleta um usuário
userRoutes.delete('/:id', UserController.destroy);

module.exports = userRoutes;
