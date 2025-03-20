import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import LogIn from './app/components/LogIn';
import AuthRedirect from './app/components/AuthRedirect';
import { AppProvider, useAppContext } from './app/context/AppContext.jsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainTabs from './app/components/MainTabs';

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
      AuthRedirect: 'auth',
      Main: {
        screens: {
          Home: 'home',
          Alerts: 'alerts',
          Social: 'social',
          Notifications: 'notifications'
        },
      },
    },
  },
};

function RootNavigator() {
  const { user } = useAppContext();
  return (
    <Stack.Navigator initialRouteName="LogIn" screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="AuthRedirect" component={AuthRedirect} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
   );
}


const queryClient = new QueryClient();

export default function App() {
  return (
    <PaperProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </AppProvider>
    </QueryClientProvider>
    </PaperProvider>
  );
}
