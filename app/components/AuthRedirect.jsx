import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import jwt_decode from 'jwt-decode';
import { useUser } from '../context/UserContext';
import { authDomain, clientId } from '../../auth0-config';

export default function AuthRedirect() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setUser } = useUser();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      let code;
      let codeVerifier;

      if (route.params?.code) {
        code = route.params.code;
        codeVerifier = route.params.codeVerifier || AuthSession.getRedirectUrl().codeVerifier;
        console.log("Mobile auth code:", code);
      } else {
        const query = new URLSearchParams(window.location.search);
        code = query.get('code');
        codeVerifier = query.get('code_verifier');
        console.log("Web auth code:", code);
      }

      if (code) {
        try {
          const redirectUri = AuthSession.makeRedirectUri({
            scheme: 'myapp',
            path: 'auth',
            useProxy: Platform.OS !== 'web',
          });

          const tokenResponse = await fetch(`https://${authDomain}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grant_type: 'authorization_code',
              client_id: clientId,
              code,
              redirect_uri: redirectUri,
              code_verifier: codeVerifier,
            }),
          });

          if (!tokenResponse.ok) {
            throw new Error(`Token exchange failed: ${await tokenResponse.text()}`);
          }

          const tokens = await tokenResponse.json();
          console.log("Tokens received:", tokens);

          const decodedClaims = jwt_decode(tokens.id_token);
          console.log("Decoded user claims:", decodedClaims);
          setUser(decodedClaims);

          if (window && window.history) {
            window.history.replaceState({}, document.title, '/');
          }

          navigation.navigate('Home');
        } catch (error) {
          console.error("Error during auth redirect:", error);
          navigation.navigate('LogIn');
        }
      } else {
        console.log("No auth code found, navigating to LogIn");
        navigation.navigate('LogIn');
      }
    };

    handleAuthRedirect();
  }, [navigation, route, setUser]);

  return null;
}