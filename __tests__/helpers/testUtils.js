import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserProvider } from '../../app/context/UserContext';
import Home from '../../app/components/Home';

export const renderWithProvider = (component, { username = null } = {}) => {
  return render(
    <UserProvider initialUsername={username}>
      {component}
    </UserProvider>
  );
};

export const testPlatformSpecificBehavior = (platform, config, { mockNavigate, wrapper }) => {
  describe(`${platform} specific behavior`, () => {
    it(`renders ${platform} login button correctly`, () => {
      const { getByTestId } = renderWithProvider(<Home />);
      const loginButton = getByTestId('login-button');
      expect(loginButton).toBeTruthy();
      expect(loginButton.props.style).toMatchObject(config.buttonStyles.login);
    });

    it(`renders ${platform} logout button correctly when logged in`, () => {
      const { getByTestId } = renderWithProvider(<Home />, { username: 'TestUser' });
      const logoutButton = getByTestId('logout-button');
      expect(logoutButton).toBeTruthy();
      expect(logoutButton.props.style).toMatchObject(config.buttonStyles.logout);
    });

    it(`renders ${platform} weather button correctly when logged in`, () => {
      const { getByTestId } = renderWithProvider(<Home />, { username: 'TestUser' });
      const weatherButton = getByTestId('weather-button');
      expect(weatherButton).toBeTruthy();
      expect(weatherButton.props.style).toMatchObject(config.buttonStyles.weather);
    });

    it(`handles ${platform} button interactions correctly`, () => {
      const { getByTestId } = renderWithProvider(<Home />, { username: 'TestUser' });
      
      fireEvent.press(getByTestId('weather-button'));
      expect(mockNavigate).toHaveBeenCalledWith('Weather');

      fireEvent.press(getByTestId('logout-button'));
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
}; 