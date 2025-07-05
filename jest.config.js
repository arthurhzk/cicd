module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'app.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true
};