import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from '../app/components/MainTabs';
import { jest, describe, test, expect } from '@jest/globals';

// Mock the navigation dependencies
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children, screenOptions }) => (
      <mock-navigator screenOptions={screenOptions}>{children}</mock-navigator>
    ),
    Screen: ({ name, component, options }) => (
      <mock-screen name={name} component={component} options={options} />
    ),
  }),
}));

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }) => (
    <mock-icon name={name} size={size} color={color} />
  ),
}));

// Mock the screen components
jest.mock('../app/components/Home', () => () => 'Home');
jest.mock('../app/components/Social', () => () => 'Social');
jest.mock('../app/components/Alerts', () => () => 'Alerts');
jest.mock('../app/components/Notifications', () => () => 'Notifications');

describe('MainTabs Component', () => {
  const renderWithNavigation = (component) => {
    return render(
      <NavigationContainer>
        {component}
      </NavigationContainer>
    );
  };

  test('renders Home, Alerts, Notifications, and Social tabs', () => {
    const { UNSAFE_root: root } = renderWithNavigation(<MainTabs />);
    const screens = root.findAllByType('mock-screen');

    expect(screens).toHaveLength(4);
    expect(screens[0].props.name).toBe('Home');
    expect(screens[1].props.name).toBe('Alerts');
    expect(screens[2].props.name).toBe('Notifications');
    expect(screens[3].props.name).toBe('Social');
  });

  test('configures tab screens with correct options', () => {
    const { UNSAFE_root: root } = renderWithNavigation(<MainTabs />);
    const screens = root.findAllByType('mock-screen');

    screens.forEach(screen => {
      expect(screen.props.options).toEqual({ headerShown: false });
    });
  });

  test('sets up tab navigator with correct screen options', () => {
    const { UNSAFE_root: root } = renderWithNavigation(<MainTabs />);
    const navigator = root.findByType('mock-navigator');
    const screenOptions = navigator.props.screenOptions;

    // Test that screenOptions is a function
    expect(typeof screenOptions).toBe('function');

    // Test screenOptions with Home route
    const homeOptions = screenOptions({ route: { name: 'Home' } });
    expect(homeOptions).toEqual(expect.objectContaining({
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: 'gray',
    }));

    // Test icon function for Home tab
    const homeIcon = homeOptions.tabBarIcon({ color: 'red', size: 20 });
    expect(homeIcon.props).toEqual({
      name: 'home',
      color: 'red',
      size: 20,
    });

    // Test icon function for Social tab
    const socialOptions = screenOptions({ route: { name: 'Social' } });
    const socialIcon = socialOptions.tabBarIcon({ color: 'blue', size: 24 });
    expect(socialIcon.props).toEqual({
      name: 'people',
      color: 'blue',
      size: 24,
    });
  });

  test('uses correct icon names for each tab', () => {
    const { UNSAFE_root: root } = renderWithNavigation(<MainTabs />);
    const navigator = root.findByType('mock-navigator');
    const screenOptions = navigator.props.screenOptions;

    // Test Home tab icon
    const homeIcon = screenOptions({ route: { name: 'Home' } })
      .tabBarIcon({ color: 'black', size: 24 });
    expect(homeIcon.props.name).toBe('home');

    // Test Social tab icon
    const socialIcon = screenOptions({ route: { name: 'Social' } })
      .tabBarIcon({ color: 'black', size: 24 });
    expect(socialIcon.props.name).toBe('people');
    
    // Test Alerts tab icon
    const alertsIcon = screenOptions({ route: { name: 'Alerts' } })
      .tabBarIcon({ color: 'black', size: 24 });
    expect(alertsIcon.props.name).toBe('alert-circle-outline');
  });

  test('handles unknown route names gracefully', () => {
    const { UNSAFE_root: root } = renderWithNavigation(<MainTabs />);
    const navigator = root.findByType('mock-navigator');
    const screenOptions = navigator.props.screenOptions;

    // Test with unknown route name
    const unknownIcon = screenOptions({ route: { name: 'Unknown' } })
      .tabBarIcon({ color: 'black', size: 24 });
    expect(unknownIcon.props.name).toBeUndefined();
  });
}); 