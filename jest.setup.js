import { jest } from '@jest/globals';
import '@testing-library/jest-native';

// Suppress specific console warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes('new NativeEventEmitter()') ||
    args[0]?.includes('NativeEventEmitter') ||
    args[0]?.includes('has been extracted')
  ) {
    return;
  }
  originalWarn(...args);
};

// Mock I18nManager first
jest.mock('react-native/Libraries/ReactNative/I18nManager', () => ({
  getConstants: () => ({
    isRTL: false,
    doLeftAndRightSwapInRTL: true,
    localeIdentifier: 'en_US',
  }),
  allowRTL: jest.fn(),
  forceRTL: jest.fn(),
  swapLeftAndRightInRTL: jest.fn(),
}));

// Mock NativeI18nManager
jest.mock('react-native/Libraries/ReactNative/NativeI18nManager', () => ({
  getConstants: () => ({
    isRTL: false,
    doLeftAndRightSwapInRTL: true,
    localeIdentifier: 'en_US',
  }),
}));

// Mock TurboModuleRegistry first
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({
    getConstants: () => ({}),
    get: jest.fn(),
    set: jest.fn(),
  })),
  get: jest.fn(() => ({
    playTouchSound: jest.fn(),
    setEnabled: jest.fn(),
  })),
}));

// Mock NativeSoundManager
jest.mock('react-native/Libraries/Components/Sound/NativeSoundManager', () => ({
  playTouchSound: jest.fn(),
  setEnabled: jest.fn(),
}));

// Mock StyleSheet
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: styles => styles,
  flatten: jest.fn(style => style),
  hairlineWidth: 1,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  absoluteFillObject: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  compose: jest.fn((style1, style2) => ({ ...style1, ...style2 })),
}));

// Mock ActivityIndicator
jest.mock(
  'react-native/Libraries/Components/ActivityIndicator/ActivityIndicator',
  () => 'ActivityIndicator'
);

// Mock Pressability
jest.mock('react-native/Libraries/Pressability/Pressability', () => ({
  default: class Pressability {
    constructor() {}
    configure() {
      return {};
    }
    reset() {}
    destroy() {}
    static getInstance() {
      return new Pressability();
    }
  },
}));

// Mock PixelRatio
jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  get: jest.fn(() => 1),
  getFontScale: jest.fn(() => 1),
  getPixelSizeForLayoutSize: jest.fn(size => size),
  roundToNearestPixel: jest.fn(size => size),
  startDetecting: jest.fn(),
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
  set: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Settings
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Mock NativeEventEmitter
const mockNativeEventEmitter = {
  addListener: jest.fn(),
  removeAllListeners: jest.fn(),
  removeSubscription: jest.fn(),
};

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return {
    ...RN,
    NativeEventEmitter: jest.fn(() => mockNativeEventEmitter),
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    I18nManager: {
      getConstants: () => ({
        isRTL: false,
        doLeftAndRightSwapInRTL: true,
        localeIdentifier: 'en_US',
      }),
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
      swapLeftAndRightInRTL: jest.fn(),
    },
    StyleSheet: {
      create: styles => styles,
      flatten: jest.fn(),
      absoluteFill: {},
      absoluteFillObject: {},
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    TouchableOpacity: jest.fn(
      ({ style, testID, onPress, children, className, ref, ...props }) => ({
        $$typeof: Symbol.for('react.element'),
        type: 'TouchableOpacity',
        ref: ref || null,
        props: {
          style,
          testID,
          onPress,
          className,
          children: Array.isArray(children) ? children : [children],
          ...props,
        },
      })
    ),
    Text: jest.fn(({ style, children, className, ref, ...props }) => ({
      $$typeof: Symbol.for('react.element'),
      type: 'Text',
      ref: ref || null,
      props: {
        style,
        className,
        children: Array.isArray(children) ? children : [children],
        ...props,
      },
    })),
    View: jest.fn(({ style, children, testID, className, ref, ...props }) => ({
      $$typeof: Symbol.for('react.element'),
      type: 'View',
      ref: ref || null,
      props: {
        style,
        testID,
        className,
        children: Array.isArray(children) ? children : [children],
        ...props,
      },
    })),
    Modal: jest.fn(({ children, ref, ...props }) => ({
      $$typeof: Symbol.for('react.element'),
      type: 'Modal',
      ref: ref || null,
      props: {
        ...props,
        children: Array.isArray(children) ? children : [children],
      },
    })),
    Animated: {
      View: jest.fn(({ ref, ...props }) => ({
        $$typeof: Symbol.for('react.element'),
        type: 'View',
        ref: ref || null,
        props,
      })),
      createAnimatedComponent: jest.fn(component => component),
      timing: jest.fn(() => ({
        start: jest.fn(callback => callback && callback()),
      })),
      spring: jest.fn(() => ({
        start: jest.fn(callback => callback && callback()),
      })),
      Value: jest.fn(_initial => ({
        setValue: jest.fn(),
        interpolate: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    },
  };
});

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: component => component,
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    default: {
      ...Reanimated.default,
      call: jest.fn(),
    },
  };
});

// Mock expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        apiUrl: 'https://api.example.com',
      },
    },
  },
}));

// Set up global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Add these platform-specific mocks at the top level
const mockPlatformAndroid = {
  OS: 'android',
  select: jest.fn(obj => obj.android || obj.default || obj.ios),
};

const mockPlatformIOS = {
  OS: 'ios',
  select: jest.fn(obj => obj.ios || obj.default),
};

// Export them for use in tests
global.__mockPlatformAndroid = mockPlatformAndroid;
global.__mockPlatformIOS = mockPlatformIOS;

// Update react-native-paper mock
jest.mock('react-native-paper', () => ({
  Button: ({
    testID,
    mode,
    onPress,
    style,
    labelStyle,
    contentStyle = {},
    children,
    ...props
  }) => ({
    type: 'Button',
    props: {
      testID,
      mode,
      onPress,
      style,
      labelStyle,
      contentStyle,
      children,
      ...props,
    },
  }),
  DefaultTheme: {
    colors: {
      primary: '#000000',
    },
  },
}));
