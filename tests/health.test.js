const request = require('supertest');
const app = require('../src/app');
const config = require('../src/config/database');

describe('Health Controller', () => {
    describe('GET /api/health', () => {
        it('should return 200 and health status', async () => {
            const response = await request(app).get('/api/health');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status');
            expect(response.body.status).toBe('OK');
        });
    });
});
