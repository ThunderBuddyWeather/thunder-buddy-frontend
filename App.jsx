// App.js
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import LogIn from './app/components/LogIn';
import AuthRedirect from './app/components/AuthRedirect';
import Home from './app/components/Home';
import { UserProvider } from './app/context/UserContext';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      LogIn: 'login',
      AuthRedirect: 'auth',
      Home: 'home',
    },
  },
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="LogIn">
          <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
          <Stack.Screen name="AuthRedirect" component={AuthRedirect} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
