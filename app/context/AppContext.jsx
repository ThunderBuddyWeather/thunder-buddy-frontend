import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

const AppContext = createContext();
const API_KEY = process.env.API_KEY;

const BASE_URL = Platform.OS === 'web'
  ? "http://localhost:5000"
  : `http://${process.env.DEV_IP}:5000`;
  
console.log('base url', BASE_URL)

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [alert, setAlert] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [myContacts, setMyContacts] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&include=minutely`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data.data[0]);
      }
    } catch (err) {
      console.log('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndWeather = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    // For demonstration, using a static weather object.
    setWeather({
      wind_cdir: "NE",
      rh: 59,
      pod: "d",
      lon: -78.63861,
      pres: 1006.6,
      timezone: "America/New_York",
      ob_time: "2017-08-28 16:45",
      country_code: "US",
      clouds: 75,
      vis: 10,
      wind_spd: 6.17,
      gust: 8,
      wind_cdir_full: "northeast",
      app_temp: 24.25,
      state_code: "NC",
      ts: 1503936000,
      h_angle: 0,
      dewpt: 15.65,
      weather: {
         icon: "c03d",
         code: 803,
         description: "Broken clouds"
      },
      uv: 2,
      aqi: 45,
      station: "CMVN7",
      sources: ["rtma", "CMVN7"],
      wind_dir: 50,
      elev_angle: 63,
      datetime: "2017-08-28:17",
      precip: 0,
      ghi: 444.4,
      dni: 500,
      dhi: 120,
      solar_rad: 350,
      city_name: "Raleigh",
      sunrise: "10:44",
      sunset: "23:47",
      temp: 24.19,
      lat: 35.7721,
      slp: 1022.2
    });
    // Optionally, uncomment the next line to fetch live weather:
    // await fetchWeather(latitude, longitude);
  };

  const fetchFriends = async () => {
    try {
      const currentUsername = user.nickname || user.name;
      const url = `${BASE_URL}/api/friendship/friends/${currentUsername}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setContacts(data.friends || []);
      }
    } catch (err) {
      console.log('Fetch friends error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      let token;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Failed to get push token for push notifications!');
        return;
      }
      const tokenData = await Notifications.getExpoPushTokenAsync();
      token = tokenData.data;
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    } catch (error) {
      console.error("Error while registering for push notifications:", error);
    }
  };

  useEffect(() => {
    getLocationAndWeather();
    // For web, expo-notifications is not fully supported.
    if (Platform.OS !== 'web') {
      registerForPushNotificationsAsync();
    }
  }, []);

  const pushUser = async () => {
    try {
      const payload = {
        user_id: user.sub,
        user_username: user.nickname || user.name,
        user_name: user.name,
        user_email: user.email,
        user_phone: user.phone || "",
        user_address: user.address || "",
        user_location: `${weather.lat} ${weather.lon}`,
        user_weather: JSON.stringify(weather.weather) || "",
        user_severe_weather_alert: JSON.stringify(user.severe_weather_alert) || "",
        user_profile_picture: user.picture,
        expo_push_token: expoPushToken,
      };

      const response = await fetch(
        `${BASE_URL}/api/user_account/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return null;
      }
    } catch (err) {
      console.log("Push user error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On native platforms, wait for expoPushToken; on web, proceed without it.
    if (user && weather && authToken && (Platform.OS === 'web' || expoPushToken)) {
      pushUser().then(() => {
        fetchFriends();
      });
    }
  }, [user, weather, authToken, expoPushToken]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        weather,
        setWeather,
        alert,
        setAlert,
        contacts,
        setContacts,
        myContacts,
        setMyContacts,
        authToken,
        setAuthToken,
        initialLoadComplete,
        setInitialLoadComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
