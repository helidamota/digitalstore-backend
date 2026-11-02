module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/database.js',
    ],
    coverageDirectory: 'coverage',
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    maxWorkers: 1,
    forceExit: true,
};
