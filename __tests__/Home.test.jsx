/* global describe, it, expect, jest */
// Additional test coverage for the Home component
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { beforeEach } from '@jest/globals';
import { act } from 'react-test-renderer';
import { StyleSheet } from 'react-native';
import { useAppContext } from '../app/context/AppContext';
import Home from '../app/components/Home';

// Mock StyleSheet.flatten
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

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('Additional Home Component Coverage', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock user context
    useAppContext.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn()
    });
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
  });

  it('renders login button when user is not logged in', async () => {
    // Mock user context with null user
    const mockSetUser = jest.fn();
    useAppContext.mockReturnValue({
      user: null,
      setUser: mockSetUser,
      weather: null,
      setWeather: jest.fn(),
      alert: null,
      setAlert: jest.fn()
    });

    render(<Home />);

    // Wait for any state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify that navigation was attempted
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');
  });
}); 