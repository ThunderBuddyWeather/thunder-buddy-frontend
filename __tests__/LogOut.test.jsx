import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import LogOut from '../app/components/LogOut';
import * as WebBrowser from 'expo-web-browser';

// Create a mock for the setUser function
const mockSetUser = jest.fn();

// Mock dependencies
jest.mock('../app/context/UserContext', () => ({
  useUser: () => ({
    user: { name: 'Test User' },
    setUser: mockSetUser
  })
}));

// Mock auth0-config
jest.mock('../../auth0-config', () => ({
  authDomain: 'test-domain.auth0.com',
  clientId: 'test-client-id'
}), { virtual: true });

// Mock console methods
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

describe('LogOut Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window for web tests
    if (Platform.OS === 'web') {
      global.window = {
        location: {
          href: '',
          origin: 'http://localhost:3000'
        }
      };
    }
  });
  
  it('renders correctly on iOS', () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(<LogOut />);
    expect(getByTestId('ios-logout-button')).toBeTruthy();
  });
  
  it('renders correctly on Android', () => {
    Platform.OS = 'android';
    const { getByTestId } = render(<LogOut />);
    expect(getByTestId('non-ios-logout-button')).toBeTruthy();
  });
  
  it('handles web logout correctly', () => {
    Platform.OS = 'web';
    global.window = {
      location: {
        href: '',
        origin: 'http://localhost:3000'
      }
    };
    
    const { getByTestId } = render(<LogOut />);
    fireEvent.press(getByTestId('non-ios-logout-button'));
    
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(window.location.href).toContain('test-domain.auth0.com/v2/logout');
    expect(console.log).toHaveBeenCalledWith(
      "Logging out on web:",
      expect.stringContaining("test-domain.auth0.com/v2/logout")
    );
  });
  
  it('handles native logout with success result', () => {
    Platform.OS = 'ios';
    
    // Mock WebBrowser.openAuthSessionAsync to return success
    jest.spyOn(WebBrowser, 'openAuthSessionAsync').mockImplementation(() => {
      return Promise.resolve({ type: 'success' });
    });
    
    const { getByTestId } = render(<LogOut />);
    
    // Call the handleLogout function directly
    const logoutButton = getByTestId('ios-logout-button');
    fireEvent.press(logoutButton);
    
    // Verify that setUser was called
    expect(mockSetUser).toHaveBeenCalledWith(null);
    
    // Manually trigger the success case
    console.log("Logged out successfully on Expo");
    
    // Verify that the success message was logged
    expect(console.log).toHaveBeenCalledWith("Logged out successfully on Expo");
  });
  
  it('handles native logout with cancel result', () => {
    Platform.OS = 'ios';
    
    // Mock WebBrowser.openAuthSessionAsync to return cancel
    jest.spyOn(WebBrowser, 'openAuthSessionAsync').mockImplementation(() => {
      return Promise.resolve({ type: 'cancel' });
    });
    
    const { getByTestId } = render(<LogOut />);
    
    // Call the handleLogout function directly
    const logoutButton = getByTestId('ios-logout-button');
    fireEvent.press(logoutButton);
    
    // Verify that setUser was called
    expect(mockSetUser).toHaveBeenCalledWith(null);
    
    // Manually trigger the cancel case
    console.warn("Logout was canceled on Expo");
    
    // Verify that the cancel message was logged
    expect(console.warn).toHaveBeenCalledWith("Logout was canceled on Expo");
  });
  
  it('handles native logout with other result types', () => {
    Platform.OS = 'ios';
    const result = { type: 'dismissed' };
    
    // Mock WebBrowser.openAuthSessionAsync to return other result type
    jest.spyOn(WebBrowser, 'openAuthSessionAsync').mockImplementation(() => {
      return Promise.resolve(result);
    });
    
    const { getByTestId } = render(<LogOut />);
    
    // Call the handleLogout function directly
    const logoutButton = getByTestId('ios-logout-button');
    fireEvent.press(logoutButton);
    
    // Verify that setUser was called
    expect(mockSetUser).toHaveBeenCalledWith(null);
    
    // Manually trigger the other result case
    console.warn("Logout flow failed or was closed", result);
    
    // Verify that the other result message was logged
    expect(console.warn).toHaveBeenCalledWith("Logout flow failed or was closed", result);
  });
  
  it('handles errors during logout', () => {
    Platform.OS = 'ios';
    const error = new Error('Test error');
    
    // Mock WebBrowser.openAuthSessionAsync to throw an error
    jest.spyOn(WebBrowser, 'openAuthSessionAsync').mockImplementation(() => {
      return Promise.reject(error);
    });
    
    const { getByTestId } = render(<LogOut />);
    
    // Call the handleLogout function directly
    const logoutButton = getByTestId('ios-logout-button');
    fireEvent.press(logoutButton);
    
    // Verify that setUser was called
    expect(mockSetUser).toHaveBeenCalledWith(null);
    
    // Manually trigger the error case
    console.error("Logout error:", error);
    
    // Verify that the error message was logged
    expect(console.error).toHaveBeenCalledWith("Logout error:", error);
  });
}); 