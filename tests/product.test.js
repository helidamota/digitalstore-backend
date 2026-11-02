const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models/index');
const { Product, ProductImage, ProductOption, Category, ProductCategory } = require('../src/models/index');
const jwt = require('jsonwebtoken');
const config = require('../src/config/database');

describe('Product Controller', () => {
    let product1, product2;
    let category1, category2;
    let token;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Create test categories
        category1 = await Category.create({
            name: 'Shoes',
            slug: 'shoes',
            use_in_menu: true,
        });
        category2 = await Category.create({
            name: 'Electronics',
            slug: 'electronics',
            use_in_menu: false,
        });

        // Create test products
        product1 = await Product.create({
            enabled: 1,
            name: 'Produto 01',
            slug: 'produto-01',
            stock: 10,
            description: 'Descrição do produto 01',
            price: 119.90,
            price_with_discount: 99.90,
        });
        
        // Attach categories to product1
        await ProductCategory.create({
            product_id: product1.id,
            category_id: category1.id,
        });
        await ProductCategory.create({
            product_id: product1.id,
            category_id: category2.id,
        });

        product2 = await Product.create({
            enabled: 1,
            name: 'Produto 02',
            slug: 'produto-02',
            stock: 5,
            description: 'Descrição do produto 02',
            price: 299.90,
            price_with_discount: 249.90,
        });

        // Create JWT token
        token = jwt.sign({ id: 1 }, config.jwt.secret, { expiresIn: '1d' });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/product/search', () => {
        it('should return 200 and list of products with default pagination', async () => {
            const response = await request(app).get('/api/v1/product/search');

            console.log('Response status:', response.status);
            console.log('Response body:', JSON.stringify(response.body, null, 2));

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('limit');
            expect(response.body).toHaveProperty('page');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return all products when limit is -1', async () => {
            const response = await request(app).get('/api/v1/product/search?limit=-1');

            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(-1);
            expect(response.body.data.length).toBe(2);
        });

        it('should return paginated products', async () => {
            const response = await request(app).get('/api/v1/product/search?limit=1&page=1');

            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(1);
            expect(response.body.page).toBe(1);
            expect(response.body.total).toBe(2);
            expect(response.body.data.length).toBe(1);
        });

        it('should return products filtered by match', async () => {
            const response = await request(app).get('/api/v1/product/search?match=Produto');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
        });

        it('should return products filtered by category_ids', async () => {
            const response = await request(app).get(`/api/v1/product/search?category_ids=${category1.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].id).toBe(product1.id);
        });

        it('should return products filtered by price-range', async () => {
            const response = await request(app).get('/api/v1/product/search?price-range=100-150');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].id).toBe(product1.id);
        });

        it('should return 400 for invalid query parameters', async () => {
            const response = await request(app).get('/api/v1/product/search?limit=invalid');

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/v1/product/:id', () => {
        it('should return 200 and product by ID', async () => {
            const response = await request(app).get(`/api/v1/product/${product1.id}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(product1.id);
            expect(response.body.name).toBe(product1.name);
            expect(response.body.slug).toBe(product1.slug);
            expect(response.body).toHaveProperty('category_ids');
            expect(response.body).toHaveProperty('images');
            expect(response.body).toHaveProperty('options');
        });

        it('should return 404 when product not found', async () => {
            const response = await request(app).get('/api/v1/product/9999');

            expect(response.status).toBe(404);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app).get('/api/v1/product/invalid');

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/product', () => {
        it('should return 201 and create new product', async () => {
            const newProduct = {
                enabled: true,
                name: 'Novo Produto',
                slug: 'novo-produto',
                stock: 15,
                description: 'Descrição do novo produto',
                price: 159.90,
                price_with_discount: 129.90,
                category_ids: [category1.id],
                images: [{ content: 'https://example.com/image.png' }],
                options: [{ title: 'Tamanho', shape: 'square', type: 'text', values: ['P', 'M', 'G'] }],
            };

            const response = await request(app)
                .post('/api/v1/product')
                .set('Authorization', `Bearer ${token}`)
                .send(newProduct);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(newProduct.name);
            expect(response.body.slug).toBe(newProduct.slug);
        });

        it('should return 400 when name is missing', async () => {
            const response = await request(app)
                .post('/api/v1/product')
                .set('Authorization', `Bearer ${token}`)
                .send({ slug: 'test-slug' });

            expect(response.status).toBe(400);
        });

        it('should return 400 when slug is missing', async () => {
            const response = await request(app)
                .post('/api/v1/product')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test' });

            expect(response.status).toBe(400);
        });

        it('should return 401 when no token provided', async () => {
            const response = await request(app)
                .post('/api/v1/product')
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(401);
        });

        it('should return 401 with invalid token', async () => {
            const response = await request(app)
                .post('/api/v1/product')
                .set('Authorization', 'Bearer invalid-token')
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/v1/product/:id', () => {
        it('should return 204 and update product', async () => {
            const updatedProduct = {
                enabled: true,
                name: 'Produto atualizado',
                slug: 'produto-atualizado',
                stock: 20,
                description: 'Descrição atualizada',
                price: 199.90,
                price_with_discount: 179.90,
                category_ids: [category2.id],
                images: [{ content: 'https://example.com/new-image.png' }],
                options: [{ title: 'Cor', shape: 'square', type: 'text', values: ['Azul', 'Verde'] }],
            };

            const response = await request(app)
                .put(`/api/v1/product/${product1.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedProduct);

            expect(response.status).toBe(204);

            // Verify update
            const getProduct = await request(app).get(`/api/v1/product/${product1.id}`);
            expect(getProduct.body.name).toBe(updatedProduct.name);
            expect(getProduct.body.stock).toBe(updatedProduct.stock);
        });

        it('should return 404 when product not found', async () => {
            const response = await request(app)
                .put('/api/v1/product/9999')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(404);
        });

        it('should return 401 when no token provided', async () => {
            const response = await request(app)
                .put(`/api/v1/product/${product1.id}`)
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app)
                .put('/api/v1/product/invalid')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/v1/product/:id', () => {
        it('should return 204 and delete product', async () => {
            const newProduct = await Product.create({
                enabled: 1,
                name: 'Para Deletar',
                slug: 'para-deletar',
                stock: 5,
                price: 99.90,
                price_with_discount: 79.90,
            });

            const response = await request(app)
                .delete(`/api/v1/product/${newProduct.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);

            // Verify delete
            const getProduct = await request(app).get(`/api/v1/product/${newProduct.id}`);
            expect(getProduct.status).toBe(404);
        });

        it('should return 404 when product not found', async () => {
            const response = await request(app)
                .delete('/api/v1/product/9999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('should return 401 when no token provided', async () => {
            const response = await request(app).delete(`/api/v1/product/${product1.id}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app)
                .delete('/api/v1/product/invalid')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });
    });
});
