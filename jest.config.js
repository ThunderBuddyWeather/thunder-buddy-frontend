module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-gesture-handler|react-native-paper)/',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/(utils|mocks)/'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__tests__/mocks/reactNativeMocks.js',
    '^react-native-paper$':
      '<rootDir>/__tests__/mocks/reactNativePaperMocks.js',
  },
};
