import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import LogIn from '../app/components/LogIn';

// Update mock for react-native-paper to force Button to always have testID and data-testid as 'login-button'
jest.mock('react-native-paper', () => {
  return {
    Button: props => {
      const React = require('react');
      return React.createElement(
        'button',
        {
          ...props,
          testID: 'login-button',
          'data-testid': 'login-button',
        },
        props.children
      );
    },
    Provider: ({ children }) => {
      const React = require('react');
      return React.createElement('div', null, children);
    },
    // Include any other components if needed
  };
});

/* Polyfill for StyleSheet.flatten */
if (typeof StyleSheet.flatten !== 'function') {
  StyleSheet.flatten = style => style;
}

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

// Update mock for auth0-config - line 34
jest.mock('../auth0-config', () => ({
  AUTH_DOMAIN: 'test.auth0.com',
  CLIENT_ID: 'test-client-id',
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

// Mock expo-auth-session
const mockPromptAsync = jest.fn();
const mockRequest = {
  type: 'success',
  codeVerifier: 'test-verifier',
};
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'https://test.redirect.uri'),
  useAuthRequest: jest.fn(() => [mockRequest, null, mockPromptAsync]),
  ResponseType: { Code: 'code' },
}));

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: obj => obj.ios,
  },
  StyleSheet: {
    create: styles => styles,
  },
  Text: ({ children, style, ...rest }) => (
    <span style={style} {...rest}>
      {children}
    </span>
  ),
  View: ({ children, style, ...rest }) => (
    <div style={style} {...rest}>
      {children}
    </div>
  ),
  SafeAreaView: ({ children, style, ...rest }) => (
    <div style={style} {...rest}>
      {children}
    </div>
  ),
  TouchableOpacity: props => {
    const { testID, ...otherProps } = props;
    return (
      <button data-testid={testID} {...otherProps}>
        {props.children}
      </button>
    );
  },
  // Added mocks for Appearance and AccessibilityInfo to prevent errors in react-native-paper
  Appearance: {
    addChangeListener: () => {},
    removeChangeListener: () => {},
  },
  AccessibilityInfo: {
    addEventListener: () => {},
    removeEventListener: () => {},
  },
}));

// Mock COLORS
jest.mock('../constants/COLORS', () => ({
  COLORS: {
    PRIMARY: '#007AFF',
    DISABLED: '#CCCCCC',
    WHITE: '#FFFFFF',
  },
}));

// Mock AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(() => ({})),
}));

describe('LogIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS to ios by default
    require('react-native').Platform.OS = 'ios';
  });

  it('renders correctly with all required elements', () => {
    const { getByTestId, toJSON } = render(<LogIn />);
    const button = getByTestId('login-button');
    expect(button).toBeTruthy();
    const tree = toJSON();
    expect(JSON.stringify(tree)).toMatch(/Login/);
  });

  it('disables login button when auth request is not ready', () => {
    // Mock request as null to simulate not ready state
    require('expo-auth-session').useAuthRequest.mockReturnValueOnce([
      null,
      null,
      mockPromptAsync,
    ]);

    const { getByTestId } = render(<LogIn />);
    const button = getByTestId('login-button');

    expect(button.props.disabled).toBeTruthy();
  });

  it('enables login button when auth request is ready', () => {
    // Mock request as ready
    require('expo-auth-session').useAuthRequest.mockReturnValueOnce([
      mockRequest,
      null,
      mockPromptAsync,
    ]);

    const { getByTestId } = render(<LogIn />);
    const button = getByTestId('login-button');

    expect(button.props.disabled).toBeFalsy();
  });

  describe('Web Platform', () => {
    beforeEach(() => {
      // Set platform to web
      require('react-native').Platform.OS = 'web';

      // Mock window.location
      global.window = {
        location: { href: '' },
      };
    });

    afterEach(() => {
      delete global.window;
    });

    it('redirects to Auth0 with correct parameters on web', async () => {
      const { getByTestId } = render(<LogIn />);
      const button = getByTestId('login-button');

      await act(async () => {
        fireEvent.press(button);
      });

      const expectedUrl = new URL('https://test.auth0.com/authorize');
      expectedUrl.searchParams.append('client_id', 'test-client-id');
      expectedUrl.searchParams.append('scope', 'openid profile email');
      expectedUrl.searchParams.append('response_type', 'code');
      expectedUrl.searchParams.append(
        'redirect_uri',
        'https://test.redirect.uri'
      );
      expectedUrl.searchParams.append(
        'audience',
        'https://test.auth0.com/api/v2/'
      );

      expect(window.location.href).toBe(expectedUrl.toString());
    });
  });

  describe('Native Platform', () => {
    beforeEach(() => {
      require('react-native').Platform.OS = 'ios';
    });

    it('calls promptAsync on native platforms', async () => {
      const { getByTestId } = render(<LogIn />);
      const button = getByTestId('login-button');

      await act(async () => {
        fireEvent.press(button);
      });

      expect(mockPromptAsync).toHaveBeenCalled();
    });

    it('navigates to AuthRedirect on successful auth', async () => {
      // Mock successful auth response
      const mockResponse = {
        type: 'success',
        params: { code: 'test-auth-code' },
      };
      require('expo-auth-session').useAuthRequest.mockReturnValueOnce([
        mockRequest,
        mockResponse,
        mockPromptAsync,
      ]);

      render(<LogIn />);

      // Wait for effect to run
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('AuthRedirect', {
        code: 'test-auth-code',
        codeVerifier: 'test-verifier',
      });
    });

    it('handles auth error response', async () => {
      // Mock console.error
      const mockConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Mock error response
      const mockResponse = {
        type: 'error',
        error: 'test-error',
      };
      require('expo-auth-session').useAuthRequest.mockReturnValueOnce([
        mockRequest,
        mockResponse,
        mockPromptAsync,
      ]);

      render(<LogIn />);

      // Wait for effect to run
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Mobile auth error:',
        'test-error'
      );
      mockConsoleError.mockRestore();
    });
  });
});
