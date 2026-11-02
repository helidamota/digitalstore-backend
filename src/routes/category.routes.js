const { Router } = require('express');
const validateToken = require('../middleware/validateToken');
const { Category } = require('../models/index');

const categoryRoutes = Router();

// GET /v1/category/search - Listar categorias com filtros e paginação
categoryRoutes.get('/search', async (req, res) => {
    try {
        const {
            limit = 12,
            page = 1,
            fields = 'name,slug,use_in_menu',
            use_in_menu,
        } = req.query;

        const where = {};
        if (use_in_menu) {
            where.use_in_menu = use_in_menu === 'true';
        }

        const parsedFields = fields.split(',').map(f => f.trim());

        const categories = await Category.findAll({
            where,
            attributes: parsedFields,
            limit: limit === -1 ? undefined : parseInt(limit),
            offset: parseInt(limit) * (parseInt(page) - 1),
        });

        const total = await Category.count({ where });

        return res.status(200).json({
            data: categories,
            total,
            limit: limit === -1 ? total : parseInt(limit),
            page: parseInt(page),
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// GET /v1/category/:id - Obter categoria por ID
categoryRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// POST /v1/category - Criar nova categoria
categoryRoutes.post('/', validateToken, async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required' });
        }

        const category = await Category.create({
            name,
            slug,
            use_in_menu: use_in_menu || false,
        });

        return res.status(201).json(category);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// PUT /v1/category/:id - Atualizar categoria
categoryRoutes.put('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, use_in_menu } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.update({
            name,
            slug,
            use_in_menu: use_in_menu !== undefined ? use_in_menu : category.use_in_menu,
        });

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// DELETE /v1/category/:id - Deletar categoria
categoryRoutes.delete('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = categoryRoutes;
