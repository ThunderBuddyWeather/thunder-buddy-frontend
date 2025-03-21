/* global describe, it, expect, jest, beforeEach, afterEach */
import React from 'react';
import { render, act } from '@testing-library/react-native';
import AuthRedirect from '../app/components/AuthRedirect';
import { useAppContext } from '../app/context/AppContext';
import jwt_decode from 'jwt-decode';

// Mock auth0-config
jest.mock('../auth0-config', () => ({
  AUTH_DOMAIN: 'test.auth0.com',
  CLIENT_ID: 'test-client-id',
}));

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
let mockRouteParams = {
  code: 'test_code',
  codeVerifier: 'test_verifier',
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

// Mock jwt_decode
jest.mock('jwt-decode');

// Mock fetch
global.fetch = jest.fn();

// Mock AuthSession
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'test_redirect_uri'),
  getRedirectUrl: jest.fn(() => ({ codeVerifier: 'test_verifier' })),
}));

// Mock AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

describe('AuthRedirect Component', () => {
  const mockUserData = { email: 'test@example.com', sub: 'test_sub' };
  let mockSetUser;
  let mockSetAuthToken;
  let mockUser;
  let originalWindow;
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error
    originalConsoleError = console.error;
    console.error = jest.fn();

    mockUser = null;
    mockSetUser = jest.fn(newUser => {
      mockUser = newUser;
    });
    mockSetAuthToken = jest.fn();

    mockRouteParams = {
      code: 'test_code',
      codeVerifier: 'test_verifier',
    };

    // Save original window object
    originalWindow = global.window;
    // Mock window object
    global.window = {
      location: {
        search: '?code=test_code&code_verifier=test_verifier',
        history: {
          replaceState: jest.fn(),
        },
      },
    };

    jwt_decode.mockReturnValue(mockUserData);
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id_token: 'test_token' }),
      })
    );

    // Mock useAppContext with all required values
    useAppContext.mockImplementation(() => ({
      user: mockUser,
      setUser: mockSetUser,
      setAuthToken: mockSetAuthToken,
    }));
  });

  afterEach(() => {
    // Restore original window object
    global.window = originalWindow;
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('handles mobile auth code from route params', async () => {
    render(<AuthRedirect />);

    // Allow all promises and effects to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Force a second render cycle to handle authAttempted change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    expect(mockSetAuthToken).toHaveBeenCalledWith('test_token');
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('handles web auth code from URL', async () => {
    render(<AuthRedirect />);

    // Allow all promises and effects to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Force a second render cycle to handle authAttempted change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    expect(mockSetAuthToken).toHaveBeenCalledWith('test_token');
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('handles token exchange failure', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Token exchange failed'),
      })
    );

    render(<AuthRedirect />);

    // Allow all promises and effects to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Force a second render cycle to handle authAttempted change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error during auth redirect:',
      expect.any(Error)
    );
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');
  });

  it('handles missing auth code', async () => {
    mockRouteParams = {};
    global.window.location.search = '';

    render(<AuthRedirect />);

    // Allow all promises and effects to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Force a second render cycle to handle authAttempted change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');
  });

  it('handles network error during token exchange', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<AuthRedirect />);

    // Allow all promises and effects to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Force a second render cycle to handle authAttempted change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(console.error).toHaveBeenCalledWith(
      'Error during auth redirect:',
      expect.any(Error)
    );
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');
  });

  it('navigates to Home when user is already set', async () => {
    // Set the mockUser before rendering
    mockUser = mockUserData;
    useAppContext.mockImplementation(() => ({
      user: mockUser,
      setUser: mockSetUser,
      setAuthToken: mockSetAuthToken,
    }));

    render(<AuthRedirect />);

    // Allow all promises and effects to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Force a second render cycle to handle authAttempted change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
