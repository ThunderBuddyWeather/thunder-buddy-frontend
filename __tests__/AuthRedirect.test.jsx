import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, act } from '@testing-library/react-native';
import AuthRedirect from '../app/components/AuthRedirect';
import * as AuthSession from 'expo-auth-session';
import jwt_decode from 'jwt-decode';

// Mock react-native Platform
jest.mock('react-native', () => {
  const RN = {
    Platform: {
      OS: 'ios',
      select: jest.fn(obj => obj.ios || obj.default)
    },
    StyleSheet: {
      create: jest.fn(styles => styles),
      flatten: jest.fn(style => style)
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    Pressable: 'Pressable'
  };
  
  // Add getter/setter for Platform.OS to allow mocking
  Object.defineProperty(RN.Platform, 'OS', {
    get: jest.fn(() => 'ios'),
    set: jest.fn()
  });
  
  return RN;
});

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'https://auth.expo.io/@username/myapp/auth'),
  getRedirectUrl: jest.fn(() => ({ codeVerifier: 'mock-code-verifier' }))
}));

// Mock jwt_decode
jest.mock('jwt-decode', () => jest.fn());

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn()
  }),
  useRoute: () => ({
    params: {}
  })
}));

// Mock UserContext
jest.mock('../app/context/UserContext', () => ({
  useUser: () => ({
    setUser: jest.fn()
  })
}));

// Mock auth0-config
jest.mock('../../auth0-config', () => ({
  authDomain: 'test.auth0.com',
  clientId: 'test-client-id'
}));

// Mock fetch
global.fetch = jest.fn();

describe('AuthRedirect Component', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();
  
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock navigation
    jest.spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({ navigate: mockNavigate });
    
    // Mock UserContext
    jest.spyOn(require('../app/context/UserContext'), 'useUser')
      .mockReturnValue({ setUser: mockSetUser });
    
    // Mock Platform.OS as web by default
    jest.spyOn(require('react-native').Platform, 'OS', 'get')
      .mockReturnValue('web');
    
    // Mock window location and history
    global.window = {
      location: {
        search: '',
        href: 'https://myapp.com/auth'
      },
      history: {
        replaceState: jest.fn()
      }
    };
    
    global.document = {
      title: 'Test App'
    };
    
    // Reset fetch mock
    global.fetch.mockReset();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('renders nothing (returns null)', () => {
    const { toJSON } = render(<AuthRedirect />);
    expect(toJSON()).toBeNull();
  });
  
  describe('Web platform', () => {
    it('extracts code from URL query parameters', async () => {
      // Setup URL with code
      window.location.search = '?code=test-auth-code&code_verifier=test-verifier';
      
      // Mock successful token response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'test-access-token',
          id_token: 'test-id-token',
          refresh_token: 'test-refresh-token'
        })
      });
      
      // Mock jwt_decode
      jwt_decode.mockReturnValueOnce({
        name: 'Test User',
        email: 'test@example.com'
      });
      
      await act(async () => {
        render(<AuthRedirect />);
      });
      
      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.auth0.com/oauth/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test-auth-code')
        })
      );
      
      // Verify user was set
      expect(mockSetUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com'
      });
      
      // Verify navigation to Home
      expect(mockNavigate).toHaveBeenCalledWith('Home');
      
      // Verify URL was cleaned up
      expect(window.history.replaceState).toHaveBeenCalled();
    });
    
    it('navigates to LogIn when no code is found', async () => {
      // Setup URL without code
      window.location.search = '';
      
      await act(async () => {
        render(<AuthRedirect />);
      });
      
      // Verify navigation to LogIn
      expect(mockNavigate).toHaveBeenCalledWith('LogIn');
      
      // Verify fetch was not called
      expect(global.fetch).not.toHaveBeenCalled();
    });
    
    it('handles token exchange errors', async () => {
      // Setup URL with code
      window.location.search = '?code=test-auth-code&code_verifier=test-verifier';
      
      // Mock failed token response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Invalid grant')
      });
      
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await act(async () => {
        render(<AuthRedirect />);
      });
      
      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalled();
      
      // Verify navigation to LogIn
      expect(mockNavigate).toHaveBeenCalledWith('LogIn');
      
      // Restore console.error
      consoleSpy.mockRestore();
    });
  });
  
  describe('Native platform', () => {
    beforeEach(() => {
      // Mock Platform.OS as ios
      jest.spyOn(require('react-native').Platform, 'OS', 'get')
        .mockReturnValue('ios');
      
      // Mock route with code
      jest.spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            code: 'test-mobile-code',
            codeVerifier: 'test-mobile-verifier'
          }
        });
    });
    
    it('extracts code from route params', async () => {
      // Mock successful token response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'test-access-token',
          id_token: 'test-id-token',
          refresh_token: 'test-refresh-token'
        })
      });
      
      // Mock jwt_decode
      jwt_decode.mockReturnValueOnce({
        name: 'Mobile User',
        email: 'mobile@example.com'
      });
      
      await act(async () => {
        render(<AuthRedirect />);
      });
      
      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.auth0.com/oauth/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test-mobile-code')
        })
      );
      
      // Verify user was set
      expect(mockSetUser).toHaveBeenCalledWith({
        name: 'Mobile User',
        email: 'mobile@example.com'
      });
      
      // Verify navigation to Home
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
    
    it('uses getRedirectUrl().codeVerifier when codeVerifier is not in params', async () => {
      // Mock route without codeVerifier
      jest.spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            code: 'test-mobile-code'
          }
        });
      
      // Mock successful token response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'test-access-token',
          id_token: 'test-id-token'
        })
      });
      
      // Mock jwt_decode
      jwt_decode.mockReturnValueOnce({
        name: 'Mobile User',
        email: 'mobile@example.com'
      });
      
      await act(async () => {
        render(<AuthRedirect />);
      });
      
      // Verify fetch body contains the fallback code verifier
      const fetchCall = global.fetch.mock.calls[0];
      const fetchBody = JSON.parse(fetchCall[1].body);
      expect(fetchBody.code_verifier).toBe('mock-code-verifier');
    });
    
    it('navigates to LogIn when no code is in route params', async () => {
      // Mock route without code
      jest.spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {}
        });
      
      await act(async () => {
        render(<AuthRedirect />);
      });
      
      // Verify navigation to LogIn
      expect(mockNavigate).toHaveBeenCalledWith('LogIn');
      
      // Verify fetch was not called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
}); 