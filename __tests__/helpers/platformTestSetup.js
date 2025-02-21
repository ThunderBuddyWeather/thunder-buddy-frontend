import { COLORS } from '../../constants/COLORS';
import { styles } from '../../constants/styles';
import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  fireEvent,
} from '@jest/globals';
import { renderWithProvider } from './testUtils';
import Home from '../../app/components/Home';
import React from 'react';

// Platform-specific test configurations
const platformConfigs = {
  android: {
    buttonStyles: {
      login: {
        contentStyle: {
          ...styles.button,
          backgroundColor: COLORS.secondary,
        },
      },
      logout: {
        contentStyle: {
          ...styles.button,
          backgroundColor: COLORS.secondary,
        },
      },
      weather: {
        contentStyle: {
          ...styles.button,
          backgroundColor: COLORS.primary,
        },
      },
    },
  },
  ios: {
    buttonStyles: {
      login: {
        className: 'bg-blue-600 py-3 px-4 rounded mt-5',
      },
      logout: {
        className: 'bg-red-600 py-3 px-4 rounded mt-5',
      },
      weather: {
        className: 'bg-blue-600 py-3 px-4 rounded mt-5',
      },
    },
  },
};

function verifyButtonProps(button, expectedProps, platform) {
  if (platform === 'ios') {
    expect(button.props.className).toBe(expectedProps.className);
  } else {
    const buttonStyle = button.props.contentStyle || button.props.style;
    expect(buttonStyle).toBeDefined();
    if (expectedProps.contentStyle) {
      expect(buttonStyle).toMatchObject(expectedProps.contentStyle);
    } else if (expectedProps.style) {
      expect(buttonStyle).toMatchObject(expectedProps.style);
    }
  }
}

function testPlatformSpecificBehavior(platform, config, { mockNavigate }) {
  describe(`${platform} specific behavior`, () => {
    beforeEach(() => {
      jest.resetModules();
      jest.doMock('react-native', () => ({
        Platform: {
          OS: platform,
          select: jest.fn(obj => obj[platform] || obj.default || obj.ios),
        },
      }));
      jest.doMock('react-native-paper', () =>
        require('../mocks/reactNativePaperMocks')
      );
    });

    it(`renders ${platform} login button correctly`, () => {
      const { getByTestId } = renderWithProvider(<Home />);
      const loginButton = getByTestId('login-button');
      expect(loginButton).toBeTruthy();
      verifyButtonProps(loginButton, config.buttonStyles.login, platform);
    });

    it(`renders ${platform} logout button correctly when logged in`, () => {
      const { getByTestId } = renderWithProvider(<Home />, {
        username: 'TestUser',
      });
      const logoutButton = getByTestId('logout-button');
      expect(logoutButton).toBeTruthy();
      verifyButtonProps(logoutButton, config.buttonStyles.logout, platform);
    });

    it(`renders ${platform} weather button correctly when logged in`, () => {
      const { getByTestId } = renderWithProvider(<Home />, {
        username: 'TestUser',
      });
      const weatherButton = getByTestId('weather-button');
      expect(weatherButton).toBeTruthy();
      verifyButtonProps(weatherButton, config.buttonStyles.weather, platform);
    });

    it(`handles ${platform} button interactions correctly`, () => {
      const { getByTestId } = renderWithProvider(<Home />, {
        username: 'TestUser',
      });

      fireEvent.press(getByTestId('weather-button'));
      expect(mockNavigate).toHaveBeenCalledWith('Weather');

      fireEvent.press(getByTestId('logout-button'));
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
}

export const setupPlatformTests = ({ mockNavigate }) => {
  Object.entries(platformConfigs).forEach(([platform, config]) => {
    describe(`${platform.toUpperCase()} Platform Tests`, () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      testPlatformSpecificBehavior(platform, config, { mockNavigate });
    });
  });
};
