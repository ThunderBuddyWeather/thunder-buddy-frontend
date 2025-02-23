import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';
import { authDomain, clientId } from '../../auth0-config';
import styles from '../stylesheets/styles.js';

const redirectUri =
  Platform.OS === 'web'
    ? `${window.location.origin}/auth`
    : AuthSession.makeRedirectUri({ native: 'exp://192.168.1.59:8081' });

console.log('redirect uri:', redirectUri)
export default function LogIn() {

  const [request, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: { nonce: 'nonce' },
    },
    {
      authorizationEndpoint: `https://${authDomain}/authorize`,
      tokenEndpoint: `https://${authDomain}/oauth/token`,
    }
  );

  const handleLogin = () => {
    console.log("Initiating auth session...");
    if (Platform.OS === 'web') {
      const params = new URLSearchParams({
        client_id: clientId,
        scope: 'openid profile email',
        response_type: 'id_token',
        redirect_uri: redirectUri,
        nonce: 'nonce',
      });
      const authUrl = `https://${authDomain}/authorize?${params.toString()}`;
      console.log("Auth URL:", authUrl);
      window.location.href = authUrl;
    } else {
      promptAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={!request}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        <Text>Login</Text>
      </Button>
    </View>
  );
}
