export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    globals: {
        'ts-jest': {
            isolatedModules: true,
            tsconfig: 'tsconfig.json',
        },
    },
};
