import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useAppContext } from '../context/AppContext.jsx';

const API_KEY = 'bc03c97ff0b740569b8d21b93f241fa6';

export default function Preloader() {
    const { weather, setWeather } = useAppContext();
    const [loading, setLoading] = useState(true);

    const fetchWeather = async (latitude, longitude) => {
        console.log('starting weather fetch')
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
        await fetchWeather(latitude, longitude);
    };

    const pushUser = async () => {
        try {
            const response = await fetch(
            `https://localhost:5432/api/user_account/register`
            );
            const data = await response.json();
            if (response.ok) {
                console.log('set user account');
            } else {
            console.log('Failed to push user info');
            }
        } catch (err) {
            console.log('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLocationAndWeather();
    }, []);
    return ("")
}