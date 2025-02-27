/* global describe, it, expect, jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import LogOut from '../app/components/LogOut';
import { useAppContext } from '../app/context/AppContext';
import { jest, describe, beforeEach, afterEach } from '@jest/globals';

// Create mock functions
const mockNavigate = jest.fn();
const mockSetUser = jest.fn();
const mockOpenAuthSessionAsync = jest.fn();
const mockAlert = jest.fn();

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

// Mock AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: () => ({
    setUser: mockSetUser
  })
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: (...args) => mockOpenAuthSessionAsync(...args)
}));

// Mock react-native components
jest.mock('react-native', () => {
  const mockPlatform = {
    OS: 'web',
    select: (obj) => obj.ios || obj.web || obj.default
  };

  return {
    Platform: mockPlatform,
    Alert: {
      alert: mockAlert
    },
    StyleSheet: {
      create: styles => styles,
      flatten: style => {
        if (Array.isArray(style)) {
          return Object.assign({}, ...style);
        }
        return style || {};
      }
    },
    TouchableOpacity: ({ onPress, children, testID, ...props }) => {
      const React = require('react');
      return React.createElement('button', {
        onClick: onPress,
        'data-testid': testID,
        testID,
        ...props
      }, children);
    },
    Text: ({ children, ...props }) => {
      const React = require('react');
      return React.createElement('span', props, children);
    },
    View: ({ children, ...props }) => {
      const React = require('react');
      return React.createElement('div', props, children);
    }
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  Button: ({ onPress, children, testID, ...props }) => {
    const React = require('react');
    return React.createElement('button', {
      onClick: onPress,
      'data-testid': testID,
      testID,
      ...props
    }, children);
  }
}));

// Mock window.location for web
const mockLocation = {
  href: '',
  origin: 'http://localhost:3000'
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('LogOut Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
    Platform.OS = 'web';
  });

  it('renders logout button on iOS', () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(<LogOut />);
    const logoutButton = getByTestId('logout-button');
    expect(logoutButton).toBeTruthy();
  });

  it('renders logout button on web', () => {
    Platform.OS = 'web';
    const { getByTestId } = render(<LogOut />);
    const logoutButton = getByTestId('logout-button');
    expect(logoutButton).toBeTruthy();
  });

  it('handles logout on web platform', async () => {
    Platform.OS = 'web';
    const { getByTestId } = render(<LogOut />);
    const logoutButton = getByTestId('logout-button');
    
    await fireEvent.press(logoutButton);
    
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockLocation.href).toContain('https://dev-qzpcmpfoi3fsel2m.us.auth0.com/v2/logout');
    expect(mockLocation.href).toContain('returnTo=http%3A%2F%2Flocalhost%3A3000');
  });

  it('handles logout on native platform', async () => {
    Platform.OS = 'ios';
    mockOpenAuthSessionAsync.mockResolvedValueOnce({ type: 'success' });
    
    const { getByTestId } = render(<LogOut />);
    const logoutButton = getByTestId('logout-button');
    
    await fireEvent.press(logoutButton);
    
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockOpenAuthSessionAsync).toHaveBeenCalledWith(
      expect.stringContaining('https://dev-qzpcmpfoi3fsel2m.us.auth0.com/v2/logout?client_id='),
      'myapp%3A%2F%2F'
    );
  });

  it('handles logout cancellation on native platform', async () => {
    Platform.OS = 'ios';
    mockOpenAuthSessionAsync.mockResolvedValueOnce({ type: 'cancel' });
    
    const { getByTestId } = render(<LogOut />);
    const logoutButton = getByTestId('logout-button');
    
    await fireEvent.press(logoutButton);
    
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockOpenAuthSessionAsync).toHaveBeenCalled();
  });

  it('handles logout error on native platform', async () => {
    Platform.OS = 'ios';
    const mockError = new Error('Test error');
    mockOpenAuthSessionAsync.mockRejectedValueOnce(mockError);
    
    const { getByTestId } = render(<LogOut />);
    const logoutButton = getByTestId('logout-button');
    
    await fireEvent.press(logoutButton);
    
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockOpenAuthSessionAsync).toHaveBeenCalled();
  });
}); 