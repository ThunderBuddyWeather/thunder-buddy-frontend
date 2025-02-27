import React from 'react';
import { Text, Platform, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import authConfig from '../../auth0-config';
import { COLORS } from '../../constants/COLORS';

// Ensure auth session is completed when the app returns from the browser
WebBrowser.maybeCompleteAuthSession();

export default function LogIn() {
  const navigation = useNavigation();

  // Configure Auth0 request
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: authConfig.clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        audience: `https://${authConfig.authDomain}/api/v2/`
      }
    },
    {
      authorizationEndpoint: `https://${authConfig.authDomain}/authorize`,
      tokenEndpoint: `https://${authConfig.authDomain}/oauth/token`
    }
  );

  // Handle auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      
      // Navigate to auth redirect screen with auth code and verifier
      navigation.navigate('AuthRedirect', {
        code,
        codeVerifier: request.codeVerifier
      });
    } else if (response?.type === 'error') {
      console.error('Mobile auth error:', response.error);
    }
  }, [response, navigation, request]);

  // Handle login button press
  const handleLogin = async () => {
    if (Platform.OS === 'web') {
      // For web, redirect directly to Auth0
      const authUrl = new URL(`https://${authConfig.authDomain}/authorize`);
      
      // Add required parameters
      authUrl.searchParams.append('client_id', authConfig.clientId);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', 'openid profile email');
      authUrl.searchParams.append('audience', `https://${authConfig.authDomain}/api/v2/`);
      
      // Redirect to Auth0
      window.location.href = authUrl.toString();
    } else {
      // For native platforms, use Expo's AuthSession
      await promptAsync();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={!request}
      >
        <Text>Login</Text>
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: COLORS.DISABLED,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
