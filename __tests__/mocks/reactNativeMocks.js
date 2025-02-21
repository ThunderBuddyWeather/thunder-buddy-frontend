import { jest } from '@jest/globals';

export const createMockRN = (platform) => ({
  Platform: {
    OS: platform,
    select: jest.fn(obj => obj[platform] || obj.default || obj.ios),
  },
  TouchableOpacity: ({ children, style, testID, onPress, className }) => ({
    type: 'TouchableOpacity',
    props: {
      style,
      testID,
      onPress,
      className,
      children,
    },
  }),
  Text: ({ children, style, className }) => ({
    type: 'Text',
    props: {
      style,
      className,
      children,
    },
  }),
  View: ({ children, style }) => ({
    type: 'View',
    props: {
      style,
      children,
    },
  }),
  StyleSheet: {
    create: styles => styles,
  },
  NativeEventEmitter: function() {
    this.addListener = () => {};
    this.removeListeners = () => {};
  },
  NativeModules: {
    NativeUnimoduleProxy: {
      exportedMethods: [],
    },
  },
}); 