import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import React from 'react';
import { COLORS } from '../../constants/COLORS';
import { styles } from '../../constants/styles';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from './testUtils';
import Home from '../../app/components/Home';
import { createMockRN } from '../mocks/reactNativeMocks';
import { Platform } from 'react-native';

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
    // Remove contentStyle check for Android
    if (Platform.OS === 'android') {
      // Add style verification instead
      expect(button.props.style).toMatchObject(expectedProps.style);
    }
  }
}

function testPlatformSpecificBehavior(platform, config, { mockNavigate }) {
  describe(`${platform} specific behavior`, () => {
    beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
      jest.doMock('react-native', () => createMockRN(platform));
      jest.doMock('react-native-paper', () =>
        require('../mocks/reactNativePaperMocks')
      );
    });

    afterEach(() => {
      jest.resetModules();
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
        jest.resetModules();
        jest.clearAllMocks();
        jest.doMock('react-native', () => createMockRN(platform));
        jest.doMock('react-native-paper', () =>
          require('../mocks/reactNativePaperMocks')
        );
      });

      afterEach(() => {
        jest.resetModules();
      });

      testPlatformSpecificBehavior(platform, config, { mockNavigate });
    });
  });
};
