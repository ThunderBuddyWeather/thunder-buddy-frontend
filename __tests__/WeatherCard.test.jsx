/* global describe, it, expect, jest, beforeEach, afterEach */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import WeatherCard from '../app/components/WeatherCard';
import { AppProvider } from '../app/context/AppContext';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('WeatherCard', () => {
  let originalConsoleLog;
  let originalNodeEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // Store original console.log and NODE_ENV
    originalConsoleLog = console.log;
    originalNodeEnv = process.env.NODE_ENV;
    // Mock console.log to prevent async logging
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    // Restore original console.log and NODE_ENV
    console.log = originalConsoleLog;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('shows loading state initially', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    expect(getByText('Loading weather...')).toBeTruthy();
  });

  it('requests location permissions and fetches weather data', async () => {
    const mockWeatherData = {
      data: [{
        temp: 25,
        weather: { description: 'Clear sky', icon: 'c01d' },
        wind_spd: 5,
        rh: 60,
        city_name: 'Test City'
      }]
    };

    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData)
    });

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(getByText('25°C')).toBeTruthy();
      expect(getByText('Clear sky')).toBeTruthy();
      expect(getByText('City: Test City')).toBeTruthy();
      expect(getByText('Wind: 5 m/s')).toBeTruthy();
      expect(getByText('Humidity: 60%')).toBeTruthy();
    });
  });

  it('handles permission denial', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(getByText('Please grant location permissions to use app.')).toBeTruthy();
    });
  });

  it('handles location error', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockRejectedValue(new Error('Location error'));

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(getByText('Failed to get location')).toBeTruthy();
    });
  });

  it('handles weather API error with non-test environment', async () => {
    process.env.NODE_ENV = 'development';
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });
    global.fetch.mockRejectedValue(new Error('API error'));

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(getByText('Failed to fetch weather')).toBeTruthy();
      expect(console.log).toHaveBeenCalledWith('Something went wrong. Please try again later.');
    });
  });

  it('handles weather API error with test environment', async () => {
    process.env.NODE_ENV = 'test';
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });
    global.fetch.mockRejectedValue(new Error('API error'));

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(getByText('Failed to fetch weather')).toBeTruthy();
      expect(console.log).not.toHaveBeenCalledWith('Something went wrong. Please try again later.');
    });
  });

  it('handles API response not OK', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({})
    });

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(getByText('Failed to fetch weather')).toBeTruthy();
      expect(console.log).toHaveBeenCalledWith('Failed to fetch weather');
    });
  });

  it('handles missing weather data fields', async () => {
    const mockWeatherData = {
      data: [{}] // Empty weather data
    };

    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData)
    });

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(getByText('No Data')).toBeTruthy();
      expect(getByText('N/A°C')).toBeTruthy();
      expect(getByText('City: Unknown')).toBeTruthy();
      expect(getByText('Wind: N/A m/s')).toBeTruthy();
      expect(getByText('Humidity: N/A%')).toBeTruthy();
    });
  });

  it('handles partial weather data', async () => {
    const mockWeatherData = {
      data: [{
        temp: 25,
        // Missing weather description and icon
        wind_spd: 5,
        // Missing humidity
        city_name: 'Test City'
      }]
    };

    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 }
    });
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData)
    });

    const { getByText } = render(
      <AppProvider>
        <WeatherCard />
      </AppProvider>
    );

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
      expect(getByText('No Data')).toBeTruthy();
      expect(getByText('25°C')).toBeTruthy();
      expect(getByText('City: Test City')).toBeTruthy();
      expect(getByText('Wind: 5 m/s')).toBeTruthy();
      expect(getByText('Humidity: N/A%')).toBeTruthy();
    });
  });
}); 