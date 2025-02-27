import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import Weather from '../app/components/Weather';
import * as Location from 'expo-location';
import { useUser } from '../app/context/UserContext';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn()
}));

// Mock UserContext
jest.mock('../app/context/UserContext', () => ({
  useUser: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

describe('Weather Component', () => {
  // Mock data
  const mockLocation = {
    coords: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  };
  
  const mockWeatherData = {
    data: [
      {
        wind_spd: 5.7,
        temp: 22.5,
        city_name: 'New York',
        weather: {
          description: 'Partly cloudy',
          icon: 'c02d'
        }
      }
    ]
  };
  
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
  };
  
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock UserContext
    useUser.mockReturnValue({ user: mockUser });
    
    // Mock location permissions
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue(mockLocation);
    
    // Mock fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData)
    });
    
    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('renders loading state when user exists but location is not available', async () => {
    // Override the location mock to simulate loading
    Location.getCurrentPositionAsync.mockImplementation(() => new Promise(resolve => {
      // This promise never resolves, simulating a loading state
      setTimeout(() => resolve(mockLocation), 10000);
    }));
    
    const { getByTestId } = render(<Weather />);
    
    // Check for loading container
    expect(getByTestId('weather-loading')).toBeTruthy();
  });
  
  it('requests location permissions on mount', async () => {
    render(<Weather />);
    
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });
  });
  
  it('fetches current position when permissions are granted', async () => {
    render(<Weather />);
    
    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });
  });
  
  it('fetches weather data when location is available', async () => {
    render(<Weather />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}`)
      );
    });
  });
  
  it('displays location coordinates when available', async () => {
    const { getByTestId } = render(<Weather />);
    
    await waitFor(() => {
      const locationText = getByTestId('weather-location');
      expect(locationText.props.children).toContain(`${mockLocation.coords.latitude} / ${mockLocation.coords.longitude}`);
    });
  });
  
  it('displays wind speed when weather data is available', async () => {
    const { getByTestId } = render(<Weather />);
    
    await waitFor(() => {
      const windText = getByTestId('weather-wind');
      expect(windText.props.children).toContain(`${mockWeatherData.data[0].wind_spd}`);
    });
  });
  
  it('handles denied location permissions', async () => {
    // Override the permission mock to simulate denied permissions
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });
    
    const consoleSpy = jest.spyOn(console, 'log');
    render(<Weather />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Please grant location permissions to use app.');
    });
  });
  
  it('handles errors during weather fetch', async () => {
    // Override the fetch mock to simulate an error
    global.fetch.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = jest.spyOn(console, 'log');
    render(<Weather />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Something went wrong. Please try again later.');
    });
  });
  
  it('handles unsuccessful weather API responses', async () => {
    // Override the fetch mock to simulate an unsuccessful response
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'API error' })
    });
    
    const consoleSpy = jest.spyOn(console, 'log');
    render(<Weather />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('failed to fetch weather');
    });
  });
  
  it('does not fetch weather when location is null', async () => {
    // Override the location mock to return null
    Location.getCurrentPositionAsync.mockResolvedValue(null);
    
    const { getByTestId } = render(<Weather />);
    
    // Should show loading state
    expect(getByTestId('weather-loading')).toBeTruthy();
    
    // Fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  });
  
  it('shows loading state when user is null', async () => {
    // Override the user mock to return null
    useUser.mockReturnValue({ user: null });
    
    const { getByTestId } = render(<Weather />);
    
    // Should show loading state
    expect(getByTestId('weather-loading')).toBeTruthy();
  });
}); 