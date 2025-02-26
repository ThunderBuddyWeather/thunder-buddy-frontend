import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import LogOut from '../app/components/LogOut';

// Create a mock function for WebBrowser
const mockOpenAuthSessionAsync = jest.fn();

// Mock the Platform module
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios || obj.default)
}));

// Mock the expo-web-browser module
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: mockOpenAuthSessionAsync,
  dismissAuthSession: jest.fn(),
  maybeCompleteAuthSession: jest.fn()
}));

// Create a mock setUser function
const mockSetUser = jest.fn();

// Mock the UserContext
jest.mock('../app/context/UserContext', () => ({
  useUser: () => ({
    user: { name: 'Test User' },
    setUser: mockSetUser
  })
}));

// Mock auth0-config
jest.mock('../auth0-config', () => ({
  authDomain: 'test-domain.auth0.com',
  clientId: 'test-client-id'
}));

// Mock the expo-router module
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn()
  })
}));

describe('LogOut Component - Direct Test', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Reset Platform.OS for each test
    Platform.OS = 'ios';
    
    // Mock window for web tests
    global.window = {
      location: {
        href: '',
        origin: 'http://localhost:3000'
      }
    };
  });
  
  it('renders a logout button', () => {
    const { getByText } = render(<LogOut />);
    const logoutButton = getByText('Log Out');
    expect(logoutButton).toBeTruthy();
  });
}); 