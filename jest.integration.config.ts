import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  transformIgnorePatterns: ['^.+\\.js$'],
  coverageReporters: ['text', 'lcov', 'text-summary'],
  testMatch: ['**/*.integration.ts'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globalSetup: '<rootDir>/tests/global-setup.ts',
  globalTeardown: '<rootDir>/tests/global-teardown.ts',
  transform: {
    '^.+\\.[ts]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  setupFiles: ['dotenv/config'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

export default config;
