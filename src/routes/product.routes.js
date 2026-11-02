const { Router } = require('express');
const validateToken = require('../middleware/validateToken');
const { Product, ProductImage, ProductOption, ProductCategory, Category, Sequelize } = require('../models/index');

const productRoutes = Router();

// GET /v1/product/search - Listar produtos com filtros
productRoutes.get('/search', async (req, res) => {
    try {
        const {
            limit = 12,
            page = 1,
            fields = 'id,name,enabled,slug,stock,description,price,price_with_discount',
            match,
            category_ids,
            'price-range': priceRange,
            ...optionsQuery
        } = req.query;

        // Parse fields parameter
        const fieldArray = fields.split(',').map(f => f.trim());

        // Build where clause
        const where = {};

        if (match) {
            where.name = { [Sequelize.Op.like]: `%${match}%` };
        }

        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                where.price = {
                    [Sequelize.Op.gte]: minPrice,
                    [Sequelize.Op.lte]: maxPrice,
                };
            }
        }

        // Parse category_ids
        if (category_ids) {
            const categoryIdsArray = category_ids.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
            if (categoryIdsArray.length > 0) {
                // Join with product_categories to filter by categories
                where.id = {
                    [Sequelize.Op.in]: await ProductCategory.findAll({
                        attributes: ['product_id'],
                        where: { category_id: categoryIdsArray },
                        raw: true,
                    }).then(categories => categories.map(c => c.product_id)),
                };
            }
        }

        // Handle option filters
        const optionFilters = {};
        Object.keys(optionsQuery).forEach(key => {
            if (key.startsWith('option[') && key.endsWith(']')) {
                const optionId = key.substring(7, key.length - 1);
                const optionValues = optionsQuery[key].split(',');
                optionFilters[optionId] = optionValues;
            }
        });

        // If limit is -1, return all without pagination
        if (limit === '-1') {
            const products = await Product.findAll({
                attributes: fieldArray,
                where,
                include: [
                    { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
                    { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] },
                ],
                order: [['id', 'ASC']],
            });

            // Get category_ids for each product
            const productIds = products.map(p => p.id);
            const productCategories = await ProductCategory.findAll({
                where: { product_id: productIds },
                attributes: ['product_id', 'category_id'],
            });
            const categoryMap = {};
            productCategories.forEach(pc => {
                if (!categoryMap[pc.product_id]) {
                    categoryMap[pc.product_id] = [];
                }
                categoryMap[pc.product_id].push(pc.category_id);
            });

            return res.status(200).json({
                data: products.map(p => ({
                    ...p.toJSON(),
                    category_ids: categoryMap[p.id] || [],
                    images: p.images || [],
                    options: p.options || [],
                })),
                total: products.length,
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
        const total = await Product.count({ where });

        // Get paginated results
        const products = await Product.findAll({
            attributes: fieldArray,
            where,
            include: [
                { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
                { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] },
            ],
            limit: limitInt,
            offset: offset,
            order: [['id', 'ASC']],
        });

        // Get category_ids for each product
        const productIds = products.map(p => p.id);
        const productCategories = await ProductCategory.findAll({
            where: { product_id: productIds },
            attributes: ['product_id', 'category_id'],
        });
        const categoryMap = {};
        productCategories.forEach(pc => {
            if (!categoryMap[pc.product_id]) {
                categoryMap[pc.product_id] = [];
            }
            categoryMap[pc.product_id].push(pc.category_id);
        });

        return res.status(200).json({
            data: products.map(p => ({
                ...p.toJSON(),
                category_ids: categoryMap[p.id] || [],
                images: p.images || [],
                options: p.options || [],
            })),
            total,
            limit: limitInt,
            page: pageInt,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// GET /v1/product/:id - Obter produto por ID
productRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID is a positive integer
        const productId = parseInt(id, 10);
        if (isNaN(productId) || productId <= 0 || productId.toString() !== id) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findByPk(productId, {
            attributes: ['id', 'enabled', 'name', 'slug', 'stock', 'description', 'price', 'price_with_discount'],
            include: [
                { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
                { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] },
            ],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get category_ids
        const productCategories = await ProductCategory.findAll({
            where: { product_id: productId },
            attributes: ['category_id'],
        });

        return res.status(200).json({
            ...product.toJSON(),
            category_ids: productCategories.map(pc => pc.category_id),
            images: product.images || [],
            options: product.options || [],
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// POST /v1/product - Criar novo produto
productRoutes.post('/', validateToken, async (req, res) => {
    try {
        const {
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount,
            category_ids = [],
            images = [],
            options = [],
        } = req.body;

        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                message: 'Name and slug are required',
            });
        }

        const product = await Product.create({
            enabled: enabled !== undefined ? (enabled ? 1 : 0) : 0,
            name,
            slug,
            stock: stock || 0,
            description,
            price: parseFloat(price),
            price_with_discount: parseFloat(price_with_discount),
        });

        // Attach categories
        if (category_ids && category_ids.length > 0) {
            await ProductCategory.bulkCreate(category_ids.map(categoryId => ({
                product_id: product.id,
                category_id: categoryId,
            })));
        }

        // Attach images
        if (images && images.length > 0) {
            await ProductImage.bulkCreate(images.map(img => ({
                product_id: product.id,
                enabled: img.enabled !== undefined ? (img.enabled ? 1 : 0) : 0,
                path: img.content || img.path || '',
            })));
        }

        // Attach options
        if (options && options.length > 0) {
            await ProductOption.bulkCreate(options.map(opt => ({
                product_id: product.id,
                title: opt.title,
                shape: opt.shape || 'square',
                radius: opt.radius || 0,
                type: opt.type || 'text',
                values: Array.isArray(opt.values) ? opt.values.join(',') : opt.values,
            })));
        }

        return res.status(201).json(product);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// PUT /v1/product/:id - Atualizar produto
productRoutes.put('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID is a positive integer
        const productId = parseInt(id, 10);
        if (isNaN(productId) || productId <= 0 || productId.toString() !== id) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const {
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount,
            category_ids = [],
            images = [],
            options = [],
        } = req.body;

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({
            enabled: enabled !== undefined ? (enabled ? 1 : 0) : product.enabled,
            name,
            slug,
            stock: stock !== undefined ? stock : product.stock,
            description: description !== undefined ? description : product.description,
            price: price !== undefined ? parseFloat(price) : product.price,
            price_with_discount: price_with_discount !== undefined ? parseFloat(price_with_discount) : product.price_with_discount,
        });

        // Handle categories
        if (category_ids && Array.isArray(category_ids)) {
            // Clear existing categories
            await ProductCategory.destroy({ where: { product_id: productId } });
            // Add new categories
            await ProductCategory.bulkCreate(category_ids.map(categoryId => ({
                product_id: product.id,
                category_id: categoryId,
            })));
        }

        // Handle images
        if (images && Array.isArray(images)) {
            const existingImages = await ProductImage.findAll({ where: { product_id: productId } });
            const existingImageIds = existingImages.map(img => img.id);
            const newImageIds = [];

            // Process each image
            for (const img of images) {
                if (img.id && img.deleted) {
                    // Delete image
                    await ProductImage.destroy({ where: { id: img.id } });
                } else if (img.id) {
                    // Update existing image
                    newImageIds.push(img.id);
                    await ProductImage.update(
                        { path: img.content || img.path || '' },
                        { where: { id: img.id } }
                    );
                } else {
                    // Create new image
                    const newImage = await ProductImage.create({
                        product_id: product.id,
                        path: img.content || img.path || '',
                        enabled: img.enabled ? 1 : 0,
                    });
                    newImageIds.push(newImage.id);
                }
            }

            // Delete images not in the new list
            const imagesToDelete = existingImageIds.filter(id => !newImageIds.includes(id));
            if (imagesToDelete.length > 0) {
                await ProductImage.destroy({ where: { id: imagesToDelete } });
            }
        }

        // Handle options
        if (options && Array.isArray(options)) {
            const existingOptions = await ProductOption.findAll({ where: { product_id: productId } });
            const existingOptionIds = existingOptions.map(opt => opt.id);
            const newOptionIds = [];

            // Process each option
            for (const opt of options) {
                if (opt.id && opt.deleted) {
                    // Delete option
                    await ProductOption.destroy({ where: { id: opt.id } });
                } else if (opt.id) {
                    // Update existing option
                    newOptionIds.push(opt.id);
                    await ProductOption.update(
                        {
                            title: opt.title,
                            shape: opt.shape,
                            radius: opt.radius,
                            type: opt.type,
                            values: Array.isArray(opt.value) ? opt.value.join(',') : (Array.isArray(opt.values) ? opt.values.join(',') : opt.values),
                        },
                        { where: { id: opt.id } }
                    );
                } else {
                    // Create new option
                    const newOption = await ProductOption.create({
                        product_id: product.id,
                        title: opt.title,
                        shape: opt.shape,
                        radius: opt.radius,
                        type: opt.type,
                        values: Array.isArray(opt.values) ? opt.values.join(',') : opt.values,
                    });
                    newOptionIds.push(newOption.id);
                }
            }

            // Delete options not in the new list
            const optionsToDelete = existingOptionIds.filter(id => !newOptionIds.includes(id));
            if (optionsToDelete.length > 0) {
                await ProductOption.destroy({ where: { id: optionsToDelete } });
            }
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// DELETE /v1/product/:id - Deletar produto
productRoutes.delete('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID is a positive integer
        const productId = parseInt(id, 10);
        if (isNaN(productId) || productId <= 0 || productId.toString() !== id) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete related images and options
        await ProductImage.destroy({ where: { product_id: productId } });
        await ProductOption.destroy({ where: { product_id: productId } });
        await ProductCategory.destroy({ where: { product_id: productId } });

        await product.destroy();

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = productRoutes;
