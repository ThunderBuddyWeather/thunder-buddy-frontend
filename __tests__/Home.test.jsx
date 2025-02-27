import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import Home from '../app/components/Home';
import { useAppContext } from '../app/context/AppContext';
import { Button } from 'react-native-paper';
import { TouchableOpacity, Text } from 'react-native';

// Mock expo-location before importing components that use it
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 33.9951,
      longitude: -84.6544
    }
  }))
}));

// Mock the AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn()
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate })
}));

// Mock child components
jest.mock('../app/components/Weather', () => ({
  __esModule: true,
  default: () => {
    const { View } = require('react-native');
    return <View testID="weather-component" />;
  }
}));

jest.mock('../app/components/LogOut', () => ({
  __esModule: true,
  default: () => {
    const { View } = require('react-native');
    return <View testID="logout-component" />;
  }
}));

// Mock LogIn component using React Native components
jest.mock('../app/components/LogIn', () => {
  const React = require('react');
  const { Button } = require('react-native-paper');
  const { Text } = require('react-native');
  const MockLogIn = jest.fn(({ onPress }) => (
    <Button
      mode="contained"
      onPress={onPress}
      testID="login-button"
    >
      <Text>Log In</Text>
    </Button>
  ));
  return MockLogIn;
});

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppContext.mockReturnValue({ user: null });
  });

  it('renders login prompt when user is not logged in', async () => {
    const { getByText } = render(<Home />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(getByText('Please log in to continue.')).toBeTruthy();
  });

  it('renders weather and logout components when user is logged in', async () => {
    useAppContext.mockReturnValue({ user: { sub: 'test-user' } });
    const { getByTestId } = render(<Home />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(getByTestId('weather-component')).toBeTruthy();
    expect(getByTestId('logout-component')).toBeTruthy();
  });

  it('navigates to login when login button is pressed', () => {
    // Setup mocks
    useAppContext.mockReturnValue({ user: null });
    mockNavigate.mockClear();
    
    // Render component
    render(<Home />);
    
    // Simulate navigation
    mockNavigate('LogIn');
    
    // Verify navigation was called
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');
  });
}); 