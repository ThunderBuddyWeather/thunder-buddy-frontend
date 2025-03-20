import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

const AppContext = createContext();

const BASE_URL = Platform.OS === 'web'
  ? "http://localhost:5000"
  : `http://${process.env.DEV_IP}:5000`;

console.log('BASE_URL:', BASE_URL);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [weatherCoords, setWeatherCoords] = useState(null); 
  const [alert, setAlert] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const getLocationAndWeather = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    setWeatherCoords({ latitude, longitude });
    setLoading(false);
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
    if (Platform.OS !== 'web') {
      registerForPushNotificationsAsync();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        weatherCoords, 
        alert,
        setAlert,
        authToken,
        setAuthToken,
        expoPushToken,
        initialLoadComplete,
        setInitialLoadComplete,
        BASE_URL, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
