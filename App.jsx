import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import LogIn from './app/components/LogIn';
import Home from './app/components/Home';
import AuthRedirect from './app/components/AuthRedirect'; 
import { AppProvider } from './app/context/AppContext.jsx';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    'http://localhost:8081',  
    'exp://192.168.1.59:8081', 
    'myapp://',  
    Linking.createURL('/') 
  ],
  config: {
    screens: {
      LogIn: 'login',
      Home: 'home',
      AuthRedirect: 'auth' 
    },
  },
};

export default function App() {
  return (
    <PaperProvider>
      <AppProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator initialRouteName="LogIn">
            <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
            <Stack.Screen name="AuthRedirect" component={AuthRedirect} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </PaperProvider>
  );
}
