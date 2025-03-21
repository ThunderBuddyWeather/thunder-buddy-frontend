/* global describe, it, expect, jest */
// Additional test coverage for the Home component
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { beforeEach, afterEach } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { useAppContext } from '../app/context/AppContext';
import Home from '../app/components/Home';

// Mock StyleSheet.flatten
if (typeof StyleSheet.flatten !== 'function') {
  StyleSheet.flatten = style => style;
}

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'https://test.redirect.uri'),
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
  ResponseType: { Code: 'code' },
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const mockComponent = name => {
    const component = jest.fn().mockImplementation(({ children, testID }) => {
      const { View } = require('react-native');
      return <View testID={testID}>{children}</View>;
    });
    component.displayName = name;
    return component;
  };

  const Card = mockComponent('Card');
  Card.Content = mockComponent('Card.Content');
  Card.Title = mockComponent('Card.Title');

  const Button = jest
    .fn()
    .mockImplementation(({ children, onPress, testID }) => {
      const { View, Text } = require('react-native');
      return (
        <View testID={testID} onPress={onPress}>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
        </View>
      );
    });

  return {
    Button,
    Provider: mockComponent('Provider'),
    Card,
    Portal: mockComponent('Portal'),
    Modal: mockComponent('Modal'),
    Divider: mockComponent('Divider'),
    Avatar: {
      Icon: mockComponent('Avatar.Icon'),
    },
  };
});

// Mock the AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock child components
jest.mock('../app/components/WeatherCard', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    const { View, Text } = require('react-native');
    return (
      <View testID="weather-card">
        <Text>Weather Card</Text>
      </View>
    );
  }),
}));

jest.mock('../app/components/AlertCard', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    const { View, Text } = require('react-native');
    return (
      <View testID="alert-card">
        <Text>Alert Card</Text>
      </View>
    );
  }),
}));

jest.mock('../app/components/LogOut', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    const { View, Text } = require('react-native');
    return (
      <View testID="logout-component">
        <Text>Log Out</Text>
      </View>
    );
  }),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: 0, longitude: 0 } })
  ),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Home Component', () => {
  let consoleLogSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    useAppContext.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn(),
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('renders welcome message for logged in user', async () => {
    const mockUser = { name: 'Test User' };
    useAppContext.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn(),
    });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText(`Welcome, ${mockUser.name}!`)).toBeTruthy();
    });
  });

  it('renders login message when user is not logged in', async () => {
    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Please log in!')).toBeTruthy();
    });
  });

  it('renders WeatherCard and AlertCard when user is logged in', async () => {
    useAppContext.mockReturnValue({
      user: { name: 'Test User' },
      setUser: jest.fn(),
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn(),
    });

    const { getByTestId } = render(<Home />);

    await waitFor(() => {
      expect(getByTestId('weather-card')).toBeTruthy();
      expect(getByTestId('alert-card')).toBeTruthy();
    });
  });

  it('does not render WeatherCard and AlertCard when user is not logged in', async () => {
    const { queryByTestId } = render(<Home />);

    await waitFor(() => {
      expect(queryByTestId('weather-card')).toBeNull();
      expect(queryByTestId('alert-card')).toBeNull();
    });
  });

  it('navigates to login when user is not logged in', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('LogIn');
      expect(consoleLogSpy).toHaveBeenCalledWith('user', null);
      expect(consoleLogSpy).toHaveBeenCalledWith('redirecting to login...');
    });
  });

  it('handles login button press', async () => {
    const { getByTestId } = render(<Home />);

    await waitFor(() => {
      const loginButton = getByTestId('login-button');
      fireEvent.press(loginButton);
      expect(mockNavigate).toHaveBeenCalledWith('LogIn');
    });
  });

  it('shows LogOut component when user is logged in', async () => {
    useAppContext.mockReturnValue({
      user: { name: 'Test User' },
      setUser: jest.fn(),
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn(),
    });

    const { getByTestId } = render(<Home />);

    await waitFor(() => {
      expect(getByTestId('logout-component')).toBeTruthy();
    });
  });

  it('shows Login button when user is not logged in', async () => {
    const { getByTestId } = render(<Home />);

    await waitFor(() => {
      expect(getByTestId('login-button')).toBeTruthy();
    });
  });

  it('logs user state changes in useEffect', async () => {
    const mockUser = { name: 'Test User' };
    useAppContext.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      weather: null,
      alert: null,
      setWeather: jest.fn(),
      setAlert: jest.fn(),
    });

    render(<Home />);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('user', mockUser);
    });
  });
});
