import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LogIn from '../app/components/LogIn';
import * as AuthSession from 'expo-auth-session';

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

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'mock-redirect-uri'),
  useAuthRequest: jest.fn(),
  ResponseType: {
    Code: 'code'
  }
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn()
  })
}));

jest.mock('../auth0-config', () => ({
  authDomain: 'test.auth0.com',
  clientId: 'test-client-id'
}));

describe('LogIn Component', () => {
  const mockPromptAsync = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementation for useAuthRequest
    AuthSession.useAuthRequest.mockImplementation(() => [
      { codeVerifier: 'test-verifier' },
      null,
      mockPromptAsync
    ]);
    
    // Reset Platform.OS to ios for each test
    jest.spyOn(require('react-native').Platform, 'OS', 'get')
      .mockReturnValue('ios');
  });

  it('renders login button correctly', () => {
    const { getAllByText } = render(<LogIn />);
    const loginButtons = getAllByText(/login/i);
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  it('initializes auth session with correct parameters', () => {
    render(<LogIn />);
    
    expect(AuthSession.useAuthRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'test-client-id',
        scopes: ['openid', 'profile', 'email'],
        redirectUri: 'mock-redirect-uri',
        responseType: 'code',
        extraParams: {
          audience: 'https://test.auth0.com/api/v2/'
        }
      }),
      expect.objectContaining({
        authorizationEndpoint: 'https://test.auth0.com/authorize',
        tokenEndpoint: 'https://test.auth0.com/oauth/token'
      })
    );
  });

  it('disables login button when request is not ready', () => {
    // Mock request as not ready
    AuthSession.useAuthRequest.mockImplementation(() => [
      null,
      null,
      mockPromptAsync
    ]);

    const { getByText } = render(<LogIn />);
    
    // Find the login button and check if it's disabled
    try {
      const loginButton = getByText(/login/i).parent;
      expect(loginButton.props.disabled).toBe(true);
    } catch (error) {
      // Alternative approach if parent doesn't have disabled prop
      const loginButton = getByText(/login/i);
      expect(loginButton.props.disabled || (loginButton.parent && loginButton.parent.props.disabled)).toBeTruthy();
    }
  });

  describe('Platform-specific behavior', () => {
    describe('Web platform', () => {
      beforeEach(() => {
        // Mock Platform.OS as web
        jest.spyOn(require('react-native').Platform, 'OS', 'get')
          .mockReturnValue('web');
          
        // Mock window.location
        const originalLocation = window.location;
        delete window.location;
        window.location = { 
          href: '',
          // Preserve original properties
          ...originalLocation
        };
      });

      it('redirects to Auth0 on web platform', async () => {
        const { getByText } = render(<LogIn />);
        
        await act(async () => {
          fireEvent.press(getByText(/login/i));
        });

        expect(window.location.href).toContain('https://test.auth0.com/authorize');
        expect(window.location.href).toContain('client_id=test-client-id');
        expect(window.location.href).toContain('redirect_uri=mock-redirect-uri');
      });
    });

    describe('Native platform', () => {
      beforeEach(() => {
        // Mock Platform.OS as ios
        jest.spyOn(require('react-native').Platform, 'OS', 'get')
          .mockReturnValue('ios');
      });

      it('calls promptAsync on native platforms', async () => {
        const { getByText } = render(<LogIn />);
        
        await act(async () => {
          fireEvent.press(getByText(/login/i));
        });

        expect(mockPromptAsync).toHaveBeenCalled();
      });

      it('handles successful auth response', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('@react-navigation/native'), 'useNavigation')
          .mockReturnValue({ navigate: mockNavigate });

        // Mock successful auth response
        AuthSession.useAuthRequest.mockImplementation(() => [
          { codeVerifier: 'test-verifier' },
          { 
            type: 'success',
            params: { code: 'test-auth-code' }
          },
          mockPromptAsync
        ]);

        render(<LogIn />);

        // Let useEffect run
        await act(async () => {});

        expect(mockNavigate).toHaveBeenCalledWith('AuthRedirect', {
          code: 'test-auth-code',
          codeVerifier: 'test-verifier'
        });
      });

      it('handles auth error response', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        // Mock error auth response
        AuthSession.useAuthRequest.mockImplementation(() => [
          { codeVerifier: 'test-verifier' },
          { 
            type: 'error',
            error: 'test-error'
          },
          mockPromptAsync
        ]);

        render(<LogIn />);

        // Let useEffect run
        await act(async () => {});

        expect(consoleSpy).toHaveBeenCalledWith('Mobile auth error:', 'test-error');
        consoleSpy.mockRestore();
      });
    });
  });
}); 