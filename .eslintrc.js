// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    browser: true, // If your project also runs in a browser environment
    node: true, // Node environment for scripts, tooling, etc.
    es2021: true, // Enables ES2021 globals and syntax
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX since we use React
    },
    ecmaVersion: 12, // Supports modern ECMAScript features
    sourceType: 'module',
  },
  plugins: ['react', 'react-native'],
  extends: [
    'expo',
    'eslint:recommended', // Base ESLint recommended rules
    'plugin:react/recommended', // Recommended rules for React
    'plugin:react-native/all', // All rules for React Native
  ],
  ignorePatterns: ['/dist/*'],
  rules: {
    // Customize your rules here:
    'react/prop-types': 'off', // Disable prop-types requirement (if you're using TypeScript or prefer other validation)
    'react-native/no-inline-styles': 'off', // Disable inline styles warning
    'react-native/no-color-literals': 'off', // Disable color literals warning
    'react-native/sort-styles': 'off', // Disable style property sorting
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused variables, allow unused function args that start with _
    'import/order': 'off', // Disable import order checking
    'sort-imports': 'off', // Disable sorting of import statements
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};
