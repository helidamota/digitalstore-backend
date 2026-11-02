const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
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

        // Parse fields parameter
        const fieldArray = fields.split(',').map(f => f.trim());

        // Build where clause
        const where = {};
        if (use_in_menu !== undefined) {
            where.use_in_menu = use_in_menu === 'true';
        }

        // If limit is -1, return all without pagination
        if (limit === '-1') {
            const categories = await Category.findAll({
                attributes: fieldArray,
                where,
                order: [['id', 'ASC']],
            });

            return res.status(200).json({
                data: categories,
                total: categories.length,
                limit: -1,
                page: 1,
            });
        }

        // Parse limit and page as integers
        const limitInt = parseInt(limit, 10);
        const pageInt = parseInt(page, 10);

        // Calculate offset
        const offset = (pageInt - 1) * limitInt;

        // Get total count
        const total = await Category.count({ where });

        // Get paginated results
        const categories = await Category.findAll({
            attributes: fieldArray,
            where,
            limit: limitInt,
            offset: offset,
            order: [['id', 'ASC']],
        });

        return res.status(200).json({
            data: categories,
            total,
            limit: limitInt,
            page: pageInt,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// GET /v1/category/:id - Obter categoria por ID
categoryRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID is a positive integer
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId) || categoryId <= 0 || categoryId.toString() !== id) {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }

        const category = await Category.findByPk(categoryId, {
            attributes: ['id', 'name', 'slug', 'use_in_menu'],
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// POST /v1/category - Criar nova categoria
categoryRoutes.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;

        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                message: 'Name and slug are required',
            });
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
categoryRoutes.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, use_in_menu } = req.body;
        
        // Validate ID is a positive integer
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId) || categoryId <= 0 || categoryId.toString() !== id) {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.update({
            name,
            slug,
            use_in_menu,
        });

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// DELETE /v1/category/:id - Deletar categoria
categoryRoutes.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID is a positive integer
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId) || categoryId <= 0 || categoryId.toString() !== id) {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }

        const category = await Category.findByPk(categoryId);

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
