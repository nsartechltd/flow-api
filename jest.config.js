module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  coverageDirectory: './coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './junit',
        outputName: 'flow-api.xml',
      },
    ],
  ],
  transformIgnorePatterns: ['^.+\\.js$'],
  coverageReporters: ['text', 'lcov', 'text-summary'],
  testMatch: ['**/*.test.ts'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(js|ts|)$': 'ts-jest',
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
