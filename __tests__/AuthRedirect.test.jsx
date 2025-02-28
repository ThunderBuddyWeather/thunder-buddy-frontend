/* global describe, it, expect, jest, beforeEach, afterEach */
import React from 'react';
import { render, act } from '@testing-library/react-native';
import AuthRedirect from '../app/components/AuthRedirect';
import { useAppContext } from '../app/context/AppContext';
import jwt_decode from 'jwt-decode';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios'
  }
}));

// Mock navigation
const mockNavigate = jest.fn();
let mockRouteParams = {
  code: 'test_code',
  codeVerifier: 'test_verifier'
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({
    params: mockRouteParams
  })
}));

// Mock jwt_decode
jest.mock('jwt-decode');

// Mock fetch
global.fetch = jest.fn();

// Mock AuthSession
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'test_redirect_uri'),
  getRedirectUrl: jest.fn(() => ({ codeVerifier: 'test_verifier' }))
}));

// Mock AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn()
}));

describe('AuthRedirect Component', () => {
  const mockUserData = { email: 'test@example.com', sub: 'test_sub' };
  let mockSetUser;
  let mockUser;
  let originalWindow;
  let originalConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error
    originalConsoleError = console.error;
    console.error = jest.fn();

    mockSetUser = jest.fn((newUser) => {
      mockUser = newUser;
    });
    mockUser = null;
    mockRouteParams = {
      code: 'test_code',
      codeVerifier: 'test_verifier'
    };

    // Save original window object
    originalWindow = global.window;
    // Mock window object
    global.window = {
      location: {
        search: '?code=test_code&code_verifier=test_verifier',
        history: {
          replaceState: jest.fn()
        }
      }
    };

    jwt_decode.mockReturnValue(mockUserData);
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id_token: 'test_token' })
      })
    );
    useAppContext.mockImplementation(() => ({
      user: mockUser,
      setUser: mockSetUser
    }));
  });

  afterEach(() => {
    // Restore original window object
    global.window = originalWindow;
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('handles mobile auth code from route params', async () => {
    const { rerender } = render(<AuthRedirect />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('handles web auth code from URL', async () => {
    const { rerender } = render(<AuthRedirect />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('handles token exchange failure', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Token exchange failed')
      })
    );

    const { rerender } = render(<AuthRedirect />);

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

    const { rerender } = render(<AuthRedirect />);

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

    const { rerender } = render(<AuthRedirect />);

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
    mockUser = mockUserData;
    useAppContext.mockImplementation(() => ({
      user: mockUser,
      setUser: mockSetUser
    }));

    const { rerender } = render(<AuthRedirect />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
}); 