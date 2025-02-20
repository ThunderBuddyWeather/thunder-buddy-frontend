import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!location) {
      console.log('cannot lookup weather, no lat/lon');
      return;
    }
    const { latitude, longitude } = location.coords;
    const API_KEY = 'bc03c97ff0b740569b8d21b93f241fa6';
    try {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&include=minutely`
      );
      const data = await response.json();
      if (response.ok) {
        console.log('successfully fetched weather', data);
        setCurrentWeather(data);
      } else {
        console.log('failed to fetch weather');
      }
    } catch (err) {
      console.log('Something went wrong. Please try again later.');
    }
  }, [location]);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Please grant location permissions to use app.');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log('Current Location:', currentLocation);
    };
    getPermissions();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location, fetchWeather]);

  return (
    <View>
      <Text>
        {location
          ? `Location: ${location.coords.latitude} / ${location.coords.longitude}`
          : 'Waiting for location data...'}
      </Text>
      <Text>
        {currentWeather
          ? ` Wind Speed: ${currentWeather.data[0].wind_spd}`
          : ''}
      </Text>
    </View>
  );
}
