import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  transformIgnorePatterns: ['^.+\\.js$'],
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
};

export default config;
