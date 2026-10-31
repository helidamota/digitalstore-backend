const HealthService = require('../services/HealthService');

class HealthController {
    static async index(req, res) {
        try {
            const health = HealthService.check();
            return res.json(health);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = HealthController;
