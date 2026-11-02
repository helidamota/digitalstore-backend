const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/models/index');

describe('Auth Controller', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /v1/user/token', () => {
        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/v1/user/token')
                .send({ password: '123@123' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 if password is missing', async () => {
            const response = await request(app)
                .post('/v1/user/token')
                .send({ email: 'user@mail.com' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 if user does not exist', async () => {
            const response = await request(app)
                .post('/v1/user/token')
                .send({ email: 'nonexistent@mail.com', password: '123@123' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should return 200 with token for valid credentials', async () => {
            // First create a user
            await request(app)
                .post('/api/users')
                .send({
                    firstname: 'Test',
                    surname: 'User',
                    email: 'test@test.com',
                    password: '123@123',
                });

            const response = await request(app)
                .post('/v1/user/token')
                .send({ email: 'test@test.com', password: '123@123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });
    });
});
