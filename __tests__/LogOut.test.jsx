import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import LogOut from '../app/components/LogOut';
import * as WebBrowser from 'expo-web-browser';

// Mock AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: () => ({
    setUser: jest.fn()
  })
}));

// Mock WebBrowser
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn()
}));

describe('LogOut Component', () => {
  let mockSetUser;
  let originalPlatform;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetUser = jest.fn();
    jest.spyOn(require('../app/context/AppContext'), 'useAppContext')
      .mockReturnValue({ setUser: mockSetUser });
    
    // Store original Platform.OS
    originalPlatform = Platform.OS;
  });

  afterEach(() => {
    // Restore Platform.OS
    Platform.OS = originalPlatform;
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
  
  it('handles web logout correctly', async () => {
    Platform.OS = 'web';
    global.window = { location: { href: '' } };
    
    const { getByTestId } = render(<LogOut />);
    fireEvent.press(getByTestId('non-ios-logout-button'));
    
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(window.location.href).toContain('test-domain.auth0.com/v2/logout');
  });
  
  it('handles native logout with success result', async () => {
    Platform.OS = 'ios';
    WebBrowser.openAuthSessionAsync.mockResolvedValueOnce({ type: 'success' });
    
    const { getByTestId } = render(<LogOut />);
    fireEvent.press(getByTestId('ios-logout-button'));
    
    await expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
  
  it('handles native logout with cancel result', async () => {
    Platform.OS = 'ios';
    WebBrowser.openAuthSessionAsync.mockResolvedValueOnce({ type: 'cancel' });
    
    const { getByTestId } = render(<LogOut />);
    fireEvent.press(getByTestId('ios-logout-button'));
    
    await expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
  
  it('handles errors during logout', async () => {
    Platform.OS = 'ios';
    WebBrowser.openAuthSessionAsync.mockRejectedValueOnce(new Error('Test error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const { getByTestId } = render(<LogOut />);
    fireEvent.press(getByTestId('ios-logout-button'));
    
    await expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    
    consoleSpy.mockRestore();
  });
}); 