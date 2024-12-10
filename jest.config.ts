export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    testMatch: [
        '<rootDir>/tests/unit/**/*.test.ts',
        '<rootDir>/tests/e2e/**/*.e2e.test.ts',
    ],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            { isolatedModules: true, tsconfig: 'tsconfig.json' },
        ],
    },
};
