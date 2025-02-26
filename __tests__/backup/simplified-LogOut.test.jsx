import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import SimplifiedLogOut from './simplified-LogOut';

// Mock the Platform module
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios || obj.default)
}));

// Create a mock function for openAuthSessionAsync
const mockOpenAuthSessionAsync = jest.fn().mockReturnValue({ type: 'success' });

// Mock the expo-web-browser module
jest.mock('expo-web-browser', () => {
  return {
    openAuthSessionAsync: mockOpenAuthSessionAsync,
    dismissAuthSession: jest.fn(),
    maybeCompleteAuthSession: jest.fn()
  };
});

describe('SimplifiedLogOut Component', () => {
  // Mock props
  const mockSetUser = jest.fn();
  const mockAuthDomain = 'test-domain.auth0.com';
  const mockClientId = 'test-client-id';
  
  // Mock window.location for web tests
  let originalWindow;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Save original window
    originalWindow = global.window;
    
    // Mock window for web tests
    global.window = {
      location: {
        href: '',
        origin: 'http://localhost:3000'
      }
    };
  });
  
  afterEach(() => {
    // Restore window
    global.window = originalWindow;
  });

  it('renders logout button correctly', () => {
    const { getByText } = render(
      <SimplifiedLogOut 
        setUser={mockSetUser} 
        authDomain={mockAuthDomain} 
        clientId={mockClientId} 
      />
    );
    
    const logoutButton = getByText('Log Out');
    expect(logoutButton).toBeTruthy();
  });

  it('clears user data when logout button is pressed', () => {
    // Set platform to iOS
    Platform.OS = 'ios';
    
    // Render the component
    const { getByTestId } = render(
      <SimplifiedLogOut 
        setUser={mockSetUser} 
        authDomain={mockAuthDomain} 
        clientId={mockClientId} 
      />
    );
    
    // Trigger logout
    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);
    
    // Verify user state was cleared
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });

  it('calls WebBrowser.openAuthSessionAsync on iOS', () => {
    // Set platform to iOS
    Platform.OS = 'ios';
    
    // Log the mock to verify it's set up correctly
    console.log('Mock function before test:', mockOpenAuthSessionAsync);
    
    // Render the component
    const { getByTestId } = render(
      <SimplifiedLogOut 
        setUser={mockSetUser} 
        authDomain={mockAuthDomain} 
        clientId={mockClientId} 
      />
    );
    
    // Trigger logout
    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);
    
    // Log the mock calls to debug
    console.log('Mock calls after button press:', mockOpenAuthSessionAsync.mock.calls);
    
    // Verify WebBrowser.openAuthSessionAsync was called
    expect(mockOpenAuthSessionAsync).toHaveBeenCalled();
    
    // Verify the URL contains the expected domain
    const callArgs = mockOpenAuthSessionAsync.mock.calls[0];
    expect(callArgs[0]).toContain('test-domain.auth0.com/v2/logout');
  });

  it('redirects when logout button is pressed on web', () => {
    // Set platform to web
    Platform.OS = 'web';
    
    // Render the component
    const { getByTestId } = render(
      <SimplifiedLogOut 
        setUser={mockSetUser} 
        authDomain={mockAuthDomain} 
        clientId={mockClientId} 
      />
    );
    
    // Trigger logout
    const logoutButton = getByTestId('logout-button');
    fireEvent.press(logoutButton);
    
    // Verify user state was cleared
    expect(mockSetUser).toHaveBeenCalledWith(null);
    
    // Verify window.location.href was set correctly
    expect(window.location.href).toContain('test-domain.auth0.com/v2/logout');
  });
}); 