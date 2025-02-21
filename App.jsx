import React from 'react';
import Home from './app/components/Home.jsx';
import LogIn from './app/components/LogIn.jsx';
import Weather from './app/components/Weather.jsx';
import { UserProvider } from './app/context/UserContext.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Weather" component={Weather} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
