class HealthService {
    static check() {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'DigitalStore API',
        };
    }
}

module.exports = HealthService;
