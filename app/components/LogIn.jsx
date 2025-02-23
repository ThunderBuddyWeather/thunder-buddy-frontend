import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';
import { authDomain, clientId } from '../../auth0-config';
import { COLORS } from '../../constants/COLORS';

const redirectUri =
  Platform.OS === 'web'
    ? `${window.location.origin}/auth`
    : AuthSession.makeRedirectUri({ native: 'exp://192.168.1.59:8081' });

console.log('redirect uri:', redirectUri)
export default function LogIn() {

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
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
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: { fontSize: 16, color: COLORS.white, textAlign: 'center', fontFamily: 'Arial' },
});
