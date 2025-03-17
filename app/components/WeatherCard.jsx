import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { pushUser } from '../queries';  

const dummyWeather = {
  weather: { description: 'Sunny', icon: 'c01d' },
  temp: 30,
  wind_spd: 3,
  rh: 60,
  city_name: 'Dummy City',
};

export default function WeatherCard() {
  const { weatherCoords, API_KEY, authToken, user, BASE_URL, expoPushToken } = useAppContext();
  const [weatherData, setWeatherData] = useState(dummyWeather);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLiveWeather = async () => {
    if (!weatherCoords) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${weatherCoords.latitude}&lon=${weatherCoords.longitude}&key=${API_KEY}&include=minutely`
      );
      const data = await response.json();
      if (response.ok && data.data && data.data.length > 0) {
        setWeatherData(data.data[0]);
      } else {
        setError('Failed to fetch live weather.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && authToken) {
      const payload = {
        user_id: user.sub,
        user_username: user.nickname || user.name,
        user_name: user.name,
        user_email: user.email,
        user_phone: user.phone || "",
        user_address: user.address || "",
        user_location: weatherCoords ? `${weatherCoords.latitude} ${weatherCoords.longitude}` : "",
        expo_push_token: expoPushToken,
      };
      pushUser({ payload, BASE_URL, authToken })
        .then((data) => {
          console.log("User pushed successfully:", data);
        })
        .catch((err) => {
          console.error("Error pushing user:", err);
        });
    }
  }, [weatherData]);

  const condition = weatherData?.weather?.description || 'No Data';
  const iconCode = weatherData?.weather?.icon || 'c02d';
  const temp = weatherData?.temp ?? 'N/A';
  const windSpeed = weatherData?.wind_spd ?? 'N/A';
  const humidity = weatherData?.rh ?? 'N/A';
  const city = weatherData?.city_name || 'Unknown';

  const weatherbitIconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: weatherbitIconUrl }}
          style={styles.icon}
          resizeMode="contain"
          accessibilityLabel={condition}
        />
        <Text style={styles.tempOverlay}>{temp}°C</Text>
      </View>
      <Text style={styles.condition}>{condition}</Text>
      <Text style={styles.info}>City: {city}</Text>
      <Text style={styles.info}>Wind: {windSpeed} m/s</Text>
      <Text style={styles.info}>Humidity: {humidity}%</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button
        title={loading ? "Fetching..." : "Get Live Weather"}
        onPress={fetchLiveWeather}
        disabled={loading}
      />
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
    shadowRadius: 4,
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
