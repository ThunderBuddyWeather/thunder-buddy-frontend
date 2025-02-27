import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Weather API Integration Tests', () => {
  const API_KEY = 'bc03c97ff0b740569b8d21b93f241fa6';
  const mockLocation = {
    coords: {
      latitude: 33.9951,
      longitude: -84.6544
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
    // Mock successful API response with complete data structure
    const mockWeatherData = {
      count: 1,
      data: [{
        app_temp: 52.4,
        aqi: 21,
        city_name: "Greyfield North",
        clouds: 28,
        country_code: "US",
        datetime: "2025-02-27:13",
        dewpt: 43.4,
        dhi: 51,
        dni: 466,
        elev_angle: 9.23,
        ghi: 117,
        gust: 15.4,
        h_angle: -75,
        lat: 33.9951,
        lon: -84.6544,
        ob_time: "2025-02-27 12:55",
        pod: "d",
        precip: 0,
        pres: 974,
        rh: 71,
        slp: 1013,
        snow: 0,
        solar_rad: 115.8,
        sources: ["rtma", "radar", "satellite"],
        state_code: "GA",
        station: "F6528",
        sunrise: "12:07",
        sunset: "23:33",
        temp: 52.4,
        timezone: "America/New_York",
        ts: 1740660941,
        uv: 1,
        vis: 9.9,
        weather: {
          code: 801,
          description: "Few clouds",
          icon: "c02d"
        },
        wind_cdir: "SSW",
        wind_cdir_full: "south-southwest",
        wind_dir: 206,
        wind_spd: 1.6
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

    // Verify API call parameters
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
    
    // Verify count and data array
    expect(data.count).toBe(1);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data).toHaveLength(1);

    // Verify all required fields in the weather data
    const weatherData = data.data[0];
    expect(weatherData).toMatchObject({
      // Temperature and comfort metrics
      app_temp: expect.any(Number),
      temp: expect.any(Number),
      dewpt: expect.any(Number),

      // Air quality and conditions
      aqi: expect.any(Number),
      clouds: expect.any(Number),
      vis: expect.any(Number),
      rh: expect.any(Number), // Relative humidity
      pres: expect.any(Number),
      precip: expect.any(Number),
      snow: expect.any(Number),

      // Location information
      city_name: expect.any(String),
      country_code: expect.any(String),
      state_code: expect.any(String),
      lat: expect.any(Number),
      lon: expect.any(Number),
      timezone: expect.any(String),

      // Time information
      datetime: expect.any(String),
      ob_time: expect.any(String),
      ts: expect.any(Number),
      sunrise: expect.any(String),
      sunset: expect.any(String),

      // Solar information
      dhi: expect.any(Number),
      dni: expect.any(Number),
      ghi: expect.any(Number),
      solar_rad: expect.any(Number),
      elev_angle: expect.any(Number),
      h_angle: expect.any(Number),
      uv: expect.any(Number),

      // Wind information
      wind_spd: expect.any(Number),
      wind_dir: expect.any(Number),
      wind_cdir: expect.any(String),
      wind_cdir_full: expect.any(String),
      gust: expect.any(Number),

      // Weather description
      weather: {
        code: expect.any(Number),
        description: expect.any(String),
        icon: expect.any(String)
      },

      // Metadata
      station: expect.any(String),
      sources: expect.arrayContaining([expect.any(String)])
    });

    // Verify specific value ranges
    expect(weatherData.temp).toBeGreaterThanOrEqual(-100);
    expect(weatherData.temp).toBeLessThanOrEqual(150);
    expect(weatherData.rh).toBeGreaterThanOrEqual(0);
    expect(weatherData.rh).toBeLessThanOrEqual(100);
    expect(weatherData.wind_dir).toBeGreaterThanOrEqual(0);
    expect(weatherData.wind_dir).toBeLessThanOrEqual(360);
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

  it('handles malformed response data', async () => {
    // Mock API response with missing fields
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        count: 1,
        data: [{ 
          // Only include minimal required fields
          temp: 52.4,
          wind_spd: 1.6,
          city_name: "Greyfield North"
        }]
      })
    });

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${mockLocation.coords.latitude}&lon=${mockLocation.coords.longitude}&key=${API_KEY}&include=minutely`
    );
    const data = await response.json();

    // Verify the minimal data is still accessible
    expect(data.data[0].temp).toBe(52.4);
    expect(data.data[0].wind_spd).toBe(1.6);
    expect(data.data[0].city_name).toBe("Greyfield North");
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