import '@testing-library/jest-native/extend-expect';
import { jest, beforeEach, afterEach } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

// Global polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up fake timers
jest.useFakeTimers();

// Mock the fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
);

// Mock window
global.window = {
  location: {
    origin: 'http://localhost',
    href: 'http://localhost',
    search: ''
  },
  history: {
    replaceState: jest.fn()
  }
};

// Mock document
global.document = {
  title: 'test'
};

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

// Silence React Native warnings during tests
jest.spyOn(console, 'warn').mockImplementation(() => {});

// Mock the Platform module
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: obj => obj.ios || obj.default,
}));

// Basic React Native mock
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default
  },
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
    compose: (style1, style2) => ({ ...style1, ...style2 })
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Pressable: 'Pressable',
  Animated: {
    Value: () => ({
      setValue: jest.fn(),
      interpolate: jest.fn()
    }),
    View: 'Animated.View'
  }
}));

// Simple Paper mock
jest.mock('react-native-paper', () => ({
  Button: 'Button',
  TextInput: 'TextInput',
  Surface: 'Surface',
  Provider: 'Provider'
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: () => null,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: 'SafeAreaProvider',
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn()
  }),
  useRoute: () => ({
    params: {}
  })
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
