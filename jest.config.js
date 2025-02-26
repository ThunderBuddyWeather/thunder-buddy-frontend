module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './jestTimerPatch.js'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^../stylesheets/styles.js$': '<rootDir>/__tests__/mocks/styles.js',
    '^../auth0-config$': '<rootDir>/__mocks__/auth0-config.js',
    '^../auth0-config.js$': '<rootDir>/__mocks__/auth0-config.js',
    '^../../auth0-config$': '<rootDir>/__mocks__/auth0-config.js',
    '^../../auth0-config.js$': '<rootDir>/__mocks__/auth0-config.js'
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/__tests__/backup/**'
  ],
  verbose: true,
  // Ensure we use fake timers for consistent testing
  fakeTimers: {
    enableGlobally: true,
    legacyFakeTimers: true
  },
  // Exclude backup directory and any files that have been moved there
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/backup/'
  ]
}; 