const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/models/index');

describe('User Controller', () => {
    let token;
    let userId;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Create admin user for testing
        const response = await request(app)
            .post('/api/users')
            .send({
                firstname: 'Admin',
                surname: 'User',
                email: 'admin@test.com',
                password: '123@123',
            });

        userId = response.body.id;

        // Get token
        const tokenResponse = await request(app)
            .post('/api/v1/user/token')
            .send({ email: 'admin@test.com', password: '123@123' });

        token = tokenResponse.body.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/users', () => {
        it('should return 201 and create a new user without token', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({
                    firstname: 'João',
                    surname: 'Silva',
                    email: 'joao@exemplo.com',
                    password: '123@123',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.firstname).toBe('João');
            expect(response.body.surname).toBe('Silva');
        });
    });

    describe('GET /api/users', () => {
        it('should return 200 and list all users without token', async () => {
            const response = await request(app).get('/api/users');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return 200 and get user by id without token', async () => {
            const response = await request(app).get(`/api/users/${userId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', userId);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .send({ surname: 'Silva updated' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 200 and update user with valid token', async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ surname: 'Silva updated' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request(app).delete(`/api/users/${userId}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 204 and delete user with valid token', async () => {
            const createResponse = await request(app)
                .post('/api/users')
                .send({
                    firstname: 'ToDelete',
                    surname: 'User',
                    email: 'todelete@test.com',
                    password: '123@123',
                });

            const deleteResponse = await request(app)
                .delete(`/api/users/${createResponse.body.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(deleteResponse.status).toBe(204);
        });
    });
});
