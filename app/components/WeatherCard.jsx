import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useAppContext } from '../context/AppContext.jsx';

export default function WeatherCard() {
  const { weather } = useAppContext();

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
          resizeMode="contain" 
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
