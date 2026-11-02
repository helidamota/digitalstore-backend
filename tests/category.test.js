const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models/index');
const Category = require('../src/models/Category')(sequelize);
const jwt = require('jsonwebtoken');
const config = require('../src/config/database');

describe('Category Controller', () => {
    let category1, category2, category3;
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
            name: 'Offers',
            slug: 'offers',
            use_in_menu: true,
        });
        category3 = await Category.create({
            name: 'Black Friday',
            slug: 'black-friday',
            use_in_menu: false,
        });

        // Create JWT token
        token = jwt.sign({ id: 1 }, config.jwt.secret, { expiresIn: '1d' });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/category/search', () => {
        it('should return 200 and list of categories with default pagination', async () => {
            const response = await request(app).get('/api/v1/category/search');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('limit');
            expect(response.body).toHaveProperty('page');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return all categories when limit is -1', async () => {
            const response = await request(app).get('/api/v1/category/search?limit=-1');

            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(-1);
            expect(response.body.data.length).toBe(3);
        });

        it('should return paginated categories', async () => {
            const response = await request(app).get('/api/v1/category/search?limit=2&page=1');

            expect(response.status).toBe(200);
            expect(response.body.limit).toBe(2);
            expect(response.body.page).toBe(1);
            expect(response.body.total).toBe(3);
            expect(response.body.data.length).toBe(2);
        });

        it('should return categories filtered by use_in_menu', async () => {
            const response = await request(app).get('/api/v1/category/search?use_in_menu=true');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
            response.body.data.forEach((cat) => {
                expect(cat.use_in_menu).toBe(true);
            });
        });

        it('should return categories with specific fields', async () => {
            const response = await request(app).get('/api/v1/category/search?fields=name,slug');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(3);
            response.body.data.forEach((cat) => {
                expect(cat).toHaveProperty('name');
                expect(cat).toHaveProperty('slug');
                expect(cat).not.toHaveProperty('id');
            });
        });

        it('should return 400 for invalid query parameters', async () => {
            const response = await request(app).get('/api/v1/category/search?limit=invalid');

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/v1/category/:id', () => {
        it('should return 200 and category by ID', async () => {
            const response = await request(app).get(`/api/v1/category/${category1.id}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(category1.id);
            expect(response.body.name).toBe(category1.name);
            expect(response.body.slug).toBe(category1.slug);
        });

        it('should return 404 when category not found', async () => {
            const response = await request(app).get('/api/v1/category/9999');

            expect(response.status).toBe(404);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app).get('/api/v1/category/invalid');

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/category', () => {
        it('should return 201 and create new category', async () => {
            const newCategory = {
                name: 'New Category',
                slug: 'new-category',
                use_in_menu: true,
            };

            const response = await request(app)
                .post('/api/v1/category')
                .set('Authorization', `Bearer ${token}`)
                .send(newCategory);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(newCategory.name);
            expect(response.body.slug).toBe(newCategory.slug);
        });

        it('should return 400 when name is missing', async () => {
            const response = await request(app)
                .post('/api/v1/category')
                .set('Authorization', `Bearer ${token}`)
                .send({ slug: 'test-slug' });

            expect(response.status).toBe(400);
        });

        it('should return 400 when slug is missing', async () => {
            const response = await request(app)
                .post('/api/v1/category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test' });

            expect(response.status).toBe(400);
        });

        it('should return 401 when no token provided', async () => {
            const response = await request(app)
                .post('/api/v1/category')
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(401);
        });

        it('should return 401 with invalid token', async () => {
            const response = await request(app)
                .post('/api/v1/category')
                .set('Authorization', 'Bearer invalid-token')
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /api/v1/category/:id', () => {
        it('should return 204 and update category', async () => {
            const updatedCategory = {
                name: 'Updated Category',
                slug: 'updated-category',
                use_in_menu: false,
            };

            const response = await request(app)
                .put(`/api/v1/category/${category1.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedCategory);

            expect(response.status).toBe(204);

            // Verify update
            const getCategory = await request(app).get(`/api/v1/category/${category1.id}`);
            expect(getCategory.body.name).toBe(updatedCategory.name);
        });

        it('should return 404 when category not found', async () => {
            const response = await request(app)
                .put('/api/v1/category/9999')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(404);
        });

        it('should return 401 when no token provided', async () => {
            const response = await request(app)
                .put(`/api/v1/category/${category1.id}`)
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app)
                .put('/api/v1/category/invalid')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test', slug: 'test' });

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/v1/category/:id', () => {
        it('should return 204 and delete category', async () => {
            const newCategory = await Category.create({
                name: 'To Delete',
                slug: 'to-delete',
            });

            const response = await request(app)
                .delete(`/api/v1/category/${newCategory.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);

            // Verify delete
            const getCategory = await request(app).get(`/api/v1/category/${newCategory.id}`);
            expect(getCategory.status).toBe(404);
        });

        it('should return 404 when category not found', async () => {
            const response = await request(app)
                .delete('/api/v1/category/9999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('should return 401 when no token provided', async () => {
            const response = await request(app).delete(`/api/v1/category/${category1.id}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app)
                .delete('/api/v1/category/invalid')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
        });
    });
});
