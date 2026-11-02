const UserService = require('../services/UserService');
const validateToken = require('../middleware/validateToken');

class UserController {
    // GET /api/users - Lista todos os usuários
    static async index(req, res) {
        try {
            const users = await UserService.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // GET /api/users/:id - Lista um usuário específico
    static async show(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // POST /api/users - Cria um novo usuário (requer token)
    static async store(req, res) {
        try {
            const { firstname, surname, email, password } = req.body;

            if (!firstname || !surname || !email || !password) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const user = await UserService.create({ firstname, surname, email, password });
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // PUT /api/users/:id - Atualiza um usuário (requer token)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { firstname, surname, email, password } = req.body;

            const user = await UserService.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const affectedCount = await UserService.update(id, {
                firstname,
                surname,
                email,
                password,
            });

            if (affectedCount === 0) {
                return res.status(400).json({ message: 'Failed to update user' });
            }

            return res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // DELETE /api/users/:id - Deleta um usuário (requer token)
    static async destroy(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const affectedCount = await UserService.delete(id);

            if (affectedCount === 0) {
                return res.status(400).json({ message: 'Failed to delete user' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = UserController;
