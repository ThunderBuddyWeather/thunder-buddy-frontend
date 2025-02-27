/* global describe, it, expect, jest */
// Additional test coverage for the Home component
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { beforeEach } from '@jest/globals';

// Mock StyleSheet.flatten
import { StyleSheet } from 'react-native';
if (typeof StyleSheet.flatten !== 'function') {
  StyleSheet.flatten = (style) => style;
}

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn()
}));

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'https://test.redirect.uri'),
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
  ResponseType: { Code: 'code' }
}));

// Mock react-native-paper with all necessary components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const Card = ({ children, ...props }) => React.createElement('div', props, children);
  Card.displayName = 'Card';
  Card.Content = ({ children, ...props }) => React.createElement('div', props, children);
  Card.Content.displayName = 'Card.Content';
  Card.Title = ({ children, ...props }) => React.createElement('div', props, children);
  Card.Title.displayName = 'Card.Title';

  return {
    Button: ({ children, mode, onPress, style, labelStyle, ...props }) => {
      const buttonChildren = React.Children.map(children, child => {
        if (child && child.type && child.type.displayName === 'Text') {
          return child.props.children;
        }
        return child;
      });
      return React.createElement('button', { onClick: onPress, style, ...props }, buttonChildren);
    },
    Provider: ({ children }) => React.createElement('div', null, children),
    Card,
    Portal: ({ children }) => React.createElement('div', null, children),
    Modal: ({ children, ...props }) => React.createElement('div', props, children),
    Divider: ({ ...props }) => React.createElement('hr', props),
    Avatar: {
      Icon: ({ ...props }) => React.createElement('div', props)
    }
  };
});

// Mock the AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn()
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } }))
}));

// Mock react-native with proper AccessibilityInfo and Appearance implementations
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios
  },
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style
  },
  Text: Object.assign(
    ({ children, style, ...rest }) => {
      const React = require('react');
      return React.createElement('span', { style, ...rest }, children);
    },
    { displayName: 'Text' }
  ),
  View: ({ children, style, ...rest }) => {
    const React = require('react');
    return React.createElement('div', { style, ...rest }, children);
  },
  SafeAreaView: ({ children, style, ...rest }) => {
    const React = require('react');
    return React.createElement('div', { style, ...rest }, children);
  },
  ScrollView: ({ children, contentContainerStyle, ...props }) => {
    const React = require('react');
    return React.createElement('div', { style: contentContainerStyle, ...props }, children);
  },
  TouchableOpacity: ({ children, ...props }) => {
    const React = require('react');
    return React.createElement('button', props, children);
  },
  Image: ({ ...props }) => {
    const React = require('react');
    return React.createElement('img', props);
  },
  Appearance: {
    addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
    removeChangeListener: jest.fn(),
    getColorScheme: jest.fn(() => 'light')
  },
  AccessibilityInfo: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
    setAccessibilityFocus: jest.fn(),
    announceForAccessibility: jest.fn(),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false))
  }
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

import { useAppContext } from '../app/context/AppContext';
import Home from '../app/components/Home';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      data: [{
        temp: 20,
        weather: {
          description: 'Clear sky',
          icon: 'c01d'
        },
        wind_spd: 5,
        rh: 45,
        city_name: 'Test City'
      }]
    })
  })
);

describe('Additional Home Component Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear fetch mock calls
    global.fetch.mockClear();
  });

  it('does not render login button when user is logged in', async () => {
    // Set user in AppContext with weather and alert data
    useAppContext.mockReturnValue({
      user: { sub: 'test-user', name: 'Test User' },
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn()
    });

    const { queryByText } = render(<Home />);
    
    await waitFor(() => {
      expect(queryByText(/Log In/i)).toBeNull();
    });

    // Wait for any remaining promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('renders login button when user is not logged in', async () => {
    // Clear any previous mock calls
    mockNavigate.mockClear();

    // Set user as null in AppContext
    useAppContext.mockReturnValue({
      user: null,
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn()
    });

    const { findByTestId } = render(<Home />);
    
    // Wait for the button to be rendered
    const button = await findByTestId('login-button');
    expect(button).toBeTruthy();

    // Verify that navigation was attempted
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');

    // Wait for any remaining promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}); 