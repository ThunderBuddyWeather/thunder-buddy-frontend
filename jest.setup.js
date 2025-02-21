import { jest } from '@jest/globals';
import '@testing-library/jest-native';

// Mock the native modules before anything else
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  Button: 'Button',
  DefaultTheme: {
    colors: {
      primary: '#000000',
    },
  },
}));

jest.mock('react-native', () => {
  return {
    Platform: { OS: 'ios', select: jest.fn(x => x.ios) },
    NativeModules: {
      SettingsManager: {
        settings: {},
        getValue: jest.fn(),
        setValue: jest.fn(),
      },
    },
    NativeEventEmitter: jest.fn(),
    Settings: {
      get: jest.fn(),
      set: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn(styles => styles),
      flatten: jest.fn(style => style),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Animated: {
      Value: jest.fn(),
      timing: jest.fn(() => ({ start: jest.fn() })),
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));
