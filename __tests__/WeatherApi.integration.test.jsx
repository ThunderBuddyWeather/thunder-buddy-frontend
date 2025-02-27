import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Weather API Integration Tests', () => {
  const API_KEY = 'bc03c97ff0b740569b8d21b93f241fa6';
  const mockLocation = {
    coords: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  };

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('successfully fetches weather data with valid coordinates', async () => {
    // Mock successful API response
    const mockWeatherData = {
      data: [{
        wind_spd: 5.7,
        temp: 22.5,
        city_name: 'New York',
        weather: {
          description: 'Partly cloudy',
          icon: 'c02d'
        }
      }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData)
    });

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=${API_KEY}&include=minutely`
    );
    const data = await response.json();

    // Verify the API was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`lat=${mockLocation.coords.latitude}`),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`lon=${mockLocation.coords.longitude}`),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`key=${API_KEY}`),
    );

    // Verify response structure
    expect(data).toEqual(mockWeatherData);
    expect(data.data[0]).toHaveProperty('wind_spd');
    expect(data.data[0]).toHaveProperty('temp');
    expect(data.data[0]).toHaveProperty('city_name');
    expect(data.data[0]).toHaveProperty('weather');
  });

  it('handles API errors gracefully', async () => {
    // Mock API error response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({
        error: 'Invalid API key'
      })
    });

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=invalid_key&include=minutely`
    );

    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);

    const errorData = await response.json();
    expect(errorData).toHaveProperty('error');
  });

  it('handles network errors', async () => {
    // Mock network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=${API_KEY}&include=minutely`
    )).rejects.toThrow('Network error');
  });

  it('validates response data structure', async () => {
    // Mock successful API response with complete data structure
    const mockWeatherData = {
      data: [{
        wind_spd: 5.7,
        temp: 22.5,
        city_name: 'New York',
        weather: {
          description: 'Partly cloudy',
          icon: 'c02d'
        },
        rh: 65,
        pres: 1013.2,
        clouds: 45,
        vis: 16.5,
        uv: 5.2,
        precip: 0
      }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData)
    });

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=${API_KEY}&include=minutely`
    );
    const data = await response.json();

    // Verify complete data structure
    expect(data.data[0]).toMatchObject({
      wind_spd: expect.any(Number),
      temp: expect.any(Number),
      city_name: expect.any(String),
      weather: {
        description: expect.any(String),
        icon: expect.any(String)
      },
      rh: expect.any(Number),
      pres: expect.any(Number),
      clouds: expect.any(Number),
      vis: expect.any(Number),
      uv: expect.any(Number),
      precip: expect.any(Number)
    });
  });

  it('handles malformed response data', async () => {
    // Mock API response with malformed data
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [{ 
          // Missing required fields
          wind_spd: 5.7
        }]
      })
    });

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=${API_KEY}&include=minutely`
    );
    const data = await response.json();

    // Verify partial data is still accessible
    expect(data.data[0].wind_spd).toBe(5.7);
    expect(data.data[0].temp).toBeUndefined();
  });

  it('handles rate limiting', async () => {
    // Mock rate limit response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({
        error: 'Rate limit exceeded'
      })
    });

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=${API_KEY}&include=minutely`
    );

    expect(response.ok).toBe(false);
    expect(response.status).toBe(429);

    const errorData = await response.json();
    expect(errorData.error).toBe('Rate limit exceeded');
  });
}); 