import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useAppContext } from '../context/AppContext.jsx';

export default function WeatherCard() {
  const { weather, setWeather } = useAppContext();
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (latitude, longitude) => {
    const API_KEY = 'bc03c97ff0b740569b8d21b93f241fa6';
    try {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&include=minutely`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data.data[0]);
        console.log('Fetched weather:', data.data[0]);
      } else {
        console.log('Failed to fetch weather');
      }
    } catch (err) {
      console.log('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocationAndWeather = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Please grant location permissions to use app.');
        setLoading(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      fetchWeather(latitude, longitude);
    };
    getLocationAndWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading weather...</Text>
      </View>
    );
  }

  const condition = weather?.weather?.description || 'No Data';
  const iconCode = weather?.weather?.icon || 'c02d';
  const temp = weather?.temp ?? 'N/A';
  const windSpeed = weather?.wind_spd ?? 'N/A';
  const humidity = weather?.rh ?? 'N/A';
  const city = weather?.city_name || 'Unknown';

  const weatherbitIconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: weatherbitIconUrl }}
          style={styles.icon}
          alt={condition}
        />
        <Text style={styles.tempOverlay}>{temp}°C</Text>
      </View>
      <Text style={styles.condition}>{condition}</Text>
      <Text style={styles.info}>City: {city}</Text>
      <Text style={styles.info}>Wind: {windSpeed} m/s</Text>
      <Text style={styles.info}>Humidity: {humidity}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'blue',
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    maxWidth: '90%',
    minWidth: '90%',
    padding: 16,  
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  condition: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  icon: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  iconContainer: {
    height: 100,
    position: 'relative',
    width: 100,
  },
  info: {
    fontSize: 16,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  tempOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    bottom: -5,
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    right: -5,
  },
});
