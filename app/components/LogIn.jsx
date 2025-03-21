import React from 'react';
import { Text, Platform, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import styles from '../stylesheets/styles.js';
import { AUTH_DOMAIN, CLIENT_ID } from '../../auth0-config';

WebBrowser.maybeCompleteAuthSession();

export default function LogIn() {
  const navigation = useNavigation();

  const getRedirectUri = () => {
    return AuthSession.makeRedirectUri({
      scheme: 'myapp',
      path: 'auth',
      useProxy: Platform.OS !== 'web',
    });
  };

  const redirectUri = getRedirectUri();
  console.log('Configured redirect URI:', redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        audience: `https://${AUTH_DOMAIN}/api/v2/`,
      },
    },
    {
      authorizationEndpoint: `https://${AUTH_DOMAIN}/authorize`,
      tokenEndpoint: `https://${AUTH_DOMAIN}/oauth/token`,
    }
  );

  React.useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success' && response.params.code) {
        console.log('Mobile login success, code:', response.params.code);
        navigation.navigate('AuthRedirect', {
          code: response.params.code,
          codeVerifier: request.codeVerifier,
        });
      } else if (response?.type === 'error') {
        console.error('Mobile auth error:', response.error);
      } else if (response?.type) {
        console.log('Auth response:', response);
      }
    };

    handleAuthResponse();
  }, [response, navigation, request]);

  const handleLogin = async () => {
    console.log('Initiating auth session...');

    if (Platform.OS === 'web') {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: 'openid profile email',
        response_type: 'code',
        redirect_uri: redirectUri,
        audience: `https://${AUTH_DOMAIN}/api/v2/`,
      });
      const authUrl = `https://${AUTH_DOMAIN}/authorize?${params.toString()}`;
      console.log('Web auth URL:', authUrl);
      window.location.href = authUrl;
    } else {
      console.log('Starting mobile auth flow with useAuthRequest');
      await promptAsync();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={!request}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        <Text>Login</Text>
      </Button>
    </SafeAreaView>
  );
}
