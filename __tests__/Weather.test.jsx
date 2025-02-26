import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import Weather from '../app/components/Weather';
import { UserContext } from '../app/context/UserContext';
import * as Location from 'expo-location';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Weather Component', () => {
  // Mock user data
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
  };

  // Mock location data
  const mockLocation = {
    coords: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  };

  // Mock weather data
  const mockWeatherData = {
    data: [
      {
        wind_spd: 5.7,
        // Add other weather properties as needed
      },
    ],
  };

  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset fetch mock
    global.fetch.mockReset();
    
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders loading state when user exists but location is not available', () => {
    // Mock location permissions granted but location not yet available
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(null);

    const { getByText, getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    expect(getByText('Loading...')).toBeTruthy();
    expect(getByTestId('weather-loading')).toBeTruthy();
  });

  it('renders loading state when location is not available', async () => {
    // Mock location permissions denied
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const { getByText, getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Wait for useEffect to complete
    await waitFor(() => {
      expect(getByText('Loading...')).toBeTruthy();
      expect(getByTestId('weather-loading')).toBeTruthy();
    });
  });

  it('requests location permissions on mount', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock successful weather fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Verify location permission was requested
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });
  });

  it('fetches current position when permissions are granted', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock successful weather fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Verify getCurrentPositionAsync was called
    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });
  });

  it('fetches weather data when location is available', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock successful weather fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Verify fetch was called with correct URL
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}`)
      );
    });
  });

  it('displays location coordinates when available', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock successful weather fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    const { getByText, getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Wait for location to be displayed
    await waitFor(() => {
      expect(getByTestId('weather-container')).toBeTruthy();
      expect(getByText(`Location: ${mockLocation.coords.latitude} / ${mockLocation.coords.longitude}`)).toBeTruthy();
    });
  });

  it('displays wind speed when weather data is available', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock successful weather fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Wait for wind speed to be displayed
    await waitFor(() => {
      expect(getByText(` Wind Speed: ${mockWeatherData.data[0].wind_spd}`)).toBeTruthy();
    });
  });

  it('handles fetch errors gracefully', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock failed weather fetch
    global.fetch.mockRejectedValue(new Error('Network error'));

    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Verify location is still displayed
    await waitFor(() => {
      expect(getByText(`Location: ${mockLocation.coords.latitude} / ${mockLocation.coords.longitude}`)).toBeTruthy();
    });

    // Verify error was logged
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Something went wrong. Please try again later.');
    });
  });

  it('handles unsuccessful API responses', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock unsuccessful weather fetch (API error)
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'API error' }),
    });

    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Verify location is still displayed
    await waitFor(() => {
      expect(getByText(`Location: ${mockLocation.coords.latitude} / ${mockLocation.coords.longitude}`)).toBeTruthy();
    });

    // Verify error was logged
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('failed to fetch weather');
    });
  });

  it('does not fetch weather when location is null', async () => {
    // Mock location permissions granted but location not yet available
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(null);

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Wait for component to render
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('renders weather container with testID when data is available', async () => {
    // Mock successful location permission
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock successful weather fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    const { getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Weather />
      </UserContext.Provider>
    );

    // Check for the weather container
    await waitFor(() => {
      expect(getByTestId('weather-container')).toBeTruthy();
    });
  });
}); 