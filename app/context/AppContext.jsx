import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [alert, setAlert] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [myContacts, setMyContacts] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchWeather = async (latitude, longitude) => {
    console.log('starting weather fetch');
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

  const getLocationAndWeather = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Please grant location permissions to use app.');
      setLoading(false);
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    // await fetchWeather(latitude, longitude);
    setWeather({  
      "wind_cdir":"NE",
      "rh":59,
      "pod":"d",
      "lon":-78.63861,
      "pres":1006.6,
      "timezone":"America\/New_York",
      "ob_time":"2017-08-28 16:45",
      "country_code":"US",
      "clouds":75,
      "vis":10,
      "wind_spd":6.17,
      "gust": 8,
      "wind_cdir_full":"northeast",
      "app_temp":24.25,
      "state_code":"NC",
      "ts":1503936000,
      "h_angle":0,
      "dewpt":15.65,
      "weather":{  
         "icon":"c03d",
         "code": 803,
         "description":"Broken clouds"
      },
      "uv":2,
      "aqi":45,
      "station":"CMVN7",
      "sources": ["rtma", "CMVN7"],
      "wind_dir":50,
      "elev_angle":63,
      "datetime":"2017-08-28:17",
      "precip":0,
      "ghi":444.4,
      "dni":500,
      "dhi":120,
      "solar_rad":350,
      "city_name":"Raleigh",
      "sunrise":"10:44",
      "sunset":"23:47",
      "temp":24.19,
      "lat":35.7721,
      "slp":1022.2
   })
  };

  const fetchFriends = async () => {
    try {
      const currentUsername = user.nickname || user.name;
      const url = `http://127.0.0.1:5000/api/friendship/friends/${currentUsername}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setContacts(data.friends || []);
      } 
    } catch (err) {
      console.log('Failed to fetch contacts', err.message)
    } finally {
      setLoading(false);
    }
  };


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
        user_severe_weather_alert: user.severe_weather_alert || "",
        user_profile_picture: user.picture,
      };
  
      const response = await fetch(
        `http://127.0.0.1:5000/api/user_account/profile`,
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
        console.log("Set user account:", data);
      } else {
        console.log("Failed to push user info:", data);
      }
    } catch (err) {
      console.log("Something went wrong. Please try again later.", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getLocationAndWeather();
  }, []);

  useEffect(() => {
    if (user && weather && authToken) {
      console.log(authToken)
      pushUser().then(() => {
        fetchFriends();
        console.log(contacts)
      })
    }
  }, [user, weather, authToken]);

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
