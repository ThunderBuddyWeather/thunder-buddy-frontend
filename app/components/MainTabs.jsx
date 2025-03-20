import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Social from './Social';
import Alerts from './Alerts';
import Notifications from './Notifications'
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Alerts') {
            iconName = 'alert-circle-outline';
          } else if (route.name === 'Social') {
            iconName = 'people';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Alerts" component={Alerts} options={{ headerShown: false }} />
      <Tab.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
      <Tab.Screen name="Social" component={Social} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
