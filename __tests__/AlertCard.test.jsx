/* global describe, it, expect, jest, beforeEach */
import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Linking, View, Text as RNText } from 'react-native';
import AlertCard from '../app/components/AlertCard';
import { useAppContext } from '../app/context/AppContext';
import { createContext } from 'react';

const AppContext = createContext();

// Mock the AppContext
const mockSetAlert = jest.fn();
const mockWeather = {
  lat: 40.7128,
  lon: -74.006,
};

// Mock user object
const mockUser = {
  sub: 'user123',
  nickname: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
};

jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(() => ({
    weather: mockWeather,
    weatherCoords: { latitude: 40.7128, longitude: -74.006 },
    BASE_URL: 'https://api.example.com',
    alert: null,
    setAlert: mockSetAlert,
    user: mockUser,
    authToken: 'mock-token',
    expoPushToken: 'mock-expo-token',
  })),
}));

// Mock react-native's Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Mock queries.js
jest.mock('../app/queries.js', () => ({
  pushUser: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ alerts: [] }),
  })
);

// Create Card component with all necessary subcomponents
const Card = ({ children, style }) => (
  <View style={style} testID="card">
    {children}
  </View>
);
Card.displayName = 'Card';

Card.Title = ({ title, subtitle, left, testID }) => (
  <View testID={testID || 'card-title'}>
    {left && left()}
    <RNText testID="card-title-text">{title}</RNText>
    <RNText testID="card-subtitle-text">{subtitle}</RNText>
  </View>
);
Card.Title.displayName = 'Card.Title';

Card.Content = ({ children }) => <View testID="card-content">{children}</View>;
Card.Content.displayName = 'Card.Content';

const Portal = ({ children }) => <View testID="portal">{children}</View>;
Portal.displayName = 'Portal';

const Modal = ({ visible, children }) =>
  visible ? <View testID="modal">{children}</View> : null;
Modal.displayName = 'Modal';

const Button = ({ onPress, children, style }) => (
  <View testID="button" style={style} onPress={onPress}>
    {children}
  </View>
);
Button.displayName = 'Button';

const Avatar = { Icon: ({ icon }) => <View testID="avatar-icon">{icon}</View> };
Avatar.Icon.displayName = 'Avatar.Icon';

const Divider = ({ style }) => <View testID="divider" style={style} />;
Divider.displayName = 'Divider';

const Text = ({ children, style }) => (
  <RNText testID="text" style={style}>
    {children}
  </RNText>
);
Text.displayName = 'Text';

jest.mock('react-native-paper', () => ({
  Card,
  Portal,
  Modal,
  Button,
  Avatar,
  Divider,
  Text,
}));

describe('AlertCard Component', () => {
  const mockAlert = {
    title: 'Test Alert',
    severity: 'Warning',
    description: 'Test Description',
    effective_local: '2024-02-27T12:00:00',
    expires_local: '2024-02-28T12:00:00',
    regions: ['Test Region'],
    uri: 'https://test.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAppContext.mockImplementation(() => ({
      weather: mockWeather,
      weatherCoords: { latitude: 40.7128, longitude: -74.006 },
      BASE_URL: 'https://api.example.com',
      alert: null,
      setAlert: mockSetAlert,
      user: mockUser,
      authToken: 'mock-token',
      expoPushToken: 'mock-expo-token',
    }));
  });

  it('renders without alerts when no alert is present', () => {
    const { getByTestId, queryByText } = render(<AlertCard />);
    // According to the component code, it doesn't show "No active alerts" but just
    // an empty string when alert is null, so we check for the button instead
    expect(queryByText('No active alerts.')).toBeNull();
    expect(getByTestId('button')).toBeTruthy();
  });

  it('renders alert card when alert is present', async () => {
    useAppContext.mockImplementation(() => ({
      weather: mockWeather,
      alert: mockAlert,
      setAlert: mockSetAlert,
    }));

    const { getByTestId } = render(<AlertCard />);

    await waitFor(() => {
      const cardTitle = getByTestId('card-title-text');
      expect(cardTitle.props.children).toBe(mockAlert.title);
    });
  });

  it('opens modal when alert card is pressed', async () => {
    useAppContext.mockImplementation(() => ({
      weather: mockWeather,
      alert: mockAlert,
      setAlert: mockSetAlert,
    }));

    const { getByTestId, queryByTestId } = render(<AlertCard />);

    await waitFor(
      () => {
        const cardTitle = getByTestId('card-title-text');
        expect(cardTitle.props.children).toBe(mockAlert.title);
      },
      { timeout: 3000 }
    );

    // Click the alert card
    await act(async () => {
      fireEvent.press(getByTestId('card-title-text'));
    });

    expect(queryByTestId('modal')).toBeTruthy();
  });

  it('opens external link when View Official Alert is pressed', async () => {
    useAppContext.mockImplementation(() => ({
      weather: mockWeather,
      alert: mockAlert,
      setAlert: mockSetAlert,
    }));

    const { getByTestId, getByText } = render(<AlertCard />);

    await waitFor(
      () => {
        const cardTitle = getByTestId('card-title-text');
        expect(cardTitle.props.children).toBe(mockAlert.title);
      },
      { timeout: 3000 }
    );

    // Open modal
    await act(async () => {
      fireEvent.press(getByTestId('card-title-text'));
    });

    // Click View Official Alert button
    await act(async () => {
      fireEvent.press(getByText('View Official Alert'));
    });

    expect(Linking.openURL).toHaveBeenCalledWith(mockAlert.uri);
  });

  it('fetches alerts when weather data is available', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        alerts: [mockAlert],
      }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    render(<AlertCard />);

    await waitFor(
      () => {
        expect(mockSetAlert).toHaveBeenCalledWith(mockAlert);
      },
      { timeout: 3000 }
    );
  });

  it('sets dummy alert when Use Dummy Alert button is pressed', async () => {
    const mockSetAlert = jest.fn();
    useAppContext.mockReturnValue({
      weather: mockWeather,
      weatherCoords: { latitude: 40.7128, longitude: -74.006 },
      BASE_URL: 'https://api.example.com',
      alert: null,
      setAlert: mockSetAlert,
      user: mockUser,
      authToken: 'mock-token',
      expoPushToken: 'mock-expo-token',
    });

    const { getByText } = render(<AlertCard />);

    await act(async () => {
      fireEvent.press(getByText('Use Dummy Alert'));
    });

    expect(mockSetAlert).toHaveBeenCalled();
    const dummyAlert = mockSetAlert.mock.calls[0][0];
    expect(dummyAlert).toHaveProperty('description');
    expect(dummyAlert).toHaveProperty('severity');
    expect(dummyAlert).toHaveProperty('title');
  });

  it('handles API error correctly', async () => {
    // Mock the weather context with all required properties
    const mockWeatherCoords = {
      latitude: 28.5384,
      longitude: -81.3789,
    };
    const mockContextValue = {
      weather: mockWeather,
      weatherCoords: mockWeatherCoords,
      BASE_URL: 'https://api.example.com',
      alert: null,
      setAlert: jest.fn(),
      user: mockUser,
      authToken: 'mock-token',
      expoPushToken: 'mock-expo-token',
    };

    // Mock the fetch to reject with an error
    const error = new Error('API Error');
    global.fetch.mockRejectedValueOnce(error);

    // Mock console.log
    const originalConsoleLog = console.log;
    const mockLog = jest.fn();
    console.log = mockLog;

    // Render the component with context
    useAppContext.mockImplementation(() => mockContextValue);
    render(<AlertCard />);

    // Wait for the fetch to be called and error to be logged
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalled();
        expect(mockLog).toHaveBeenCalledWith('Failed to fetch alerts:', error);
      },
      { timeout: 3000 }
    );

    // Restore console.log
    console.log = originalConsoleLog;
  });

  it('handles case when weather data is missing', async () => {
    // Mock missing weather data
    useAppContext.mockReturnValue({
      weather: null,
      alert: null,
      setAlert: mockSetAlert,
    });

    // Mock console.log
    const originalConsoleLog = console.log;
    const mockLog = jest.fn();
    console.log = mockLog;

    render(<AlertCard />);

    // Wait for the console log to be called
    await waitFor(
      () => {
        expect(mockLog).toHaveBeenCalledWith(
          'Weather context not available or missing lat/lon'
        );
        // The fetch should not be called
        expect(global.fetch).not.toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Restore console.log
    console.log = originalConsoleLog;
  });

  it('handles case when weather.lat is missing', async () => {
    // Mock missing lat
    useAppContext.mockReturnValue({
      weather: { lon: -74.006 }, // only lon is present
      alert: null,
      setAlert: mockSetAlert,
    });

    // Mock console.log
    const originalConsoleLog = console.log;
    const mockLog = jest.fn();
    console.log = mockLog;

    render(<AlertCard />);

    // Wait for the console log to be called
    await waitFor(
      () => {
        expect(mockLog).toHaveBeenCalledWith(
          'Weather context not available or missing lat/lon'
        );
        // The fetch should not be called
        expect(global.fetch).not.toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Restore console.log
    console.log = originalConsoleLog;
  });

  it('handles unsuccessful API response', async () => {
    // Mock a failed API response
    const errorResponse = { error: 'Invalid API key', code: 403 };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue(errorResponse),
    });

    // Mock console.log
    const originalConsoleLog = console.log;
    const mockLog = jest.fn();
    console.log = mockLog;

    render(<AlertCard />);

    // Wait for the fetch to be called and error to be logged
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalled();
        expect(mockLog).toHaveBeenCalledWith(
          'Failed to fetch alerts:',
          errorResponse
        );
      },
      { timeout: 3000 }
    );

    // Restore console.log
    console.log = originalConsoleLog;
  });

  it('closes modal when Close button is pressed', async () => {
    useAppContext.mockImplementation(() => ({
      weather: mockWeather,
      alert: mockAlert,
      setAlert: mockSetAlert,
    }));

    const { getByTestId, queryByTestId, getByText } = render(<AlertCard />);

    // Wait for the component to render with alert
    await waitFor(() => {
      const cardTitle = getByTestId('card-title-text');
      expect(cardTitle.props.children).toBe(mockAlert.title);
    });

    // Open modal
    await act(async () => {
      fireEvent.press(getByTestId('card-title-text'));
    });

    // Verify modal is open
    expect(queryByTestId('modal')).toBeTruthy();

    // Close modal
    await act(async () => {
      fireEvent.press(getByText('Close'));
    });

    // Verify modal is closed
    expect(queryByTestId('modal')).toBeNull();
  });

  it('displays alert information correctly in the modal', async () => {
    useAppContext.mockImplementation(() => ({
      weather: mockWeather,
      alert: mockAlert,
      setAlert: mockSetAlert,
    }));

    const { getByTestId, getByText, getAllByText } = render(<AlertCard />);

    // Wait for the component to render with alert
    await waitFor(() => {
      const cardTitle = getByTestId('card-title-text');
      expect(cardTitle.props.children).toBe(mockAlert.title);
    });

    // Open modal
    await act(async () => {
      fireEvent.press(getByTestId('card-title-text'));
    });

    // Verify modal is present
    const modal = getByTestId('modal');
    expect(modal).toBeTruthy();

    // Test just enough elements to ensure modal content is correct
    // Use getAllByText to handle multiple elements with the same text
    const titleElements = getAllByText(mockAlert.title);
    expect(titleElements.length).toBeGreaterThan(0);

    // Verify buttons
    expect(getByText('Close')).toBeTruthy();
    expect(getByText('View Official Alert')).toBeTruthy();
  });
});
