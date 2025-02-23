import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import jwt_decode from 'jwt-decode';
import { useUser } from '../context/UserContext';

export default function AuthRedirect() {
  const navigation = useNavigation();
  const { setUser } = useUser();

  useEffect(() => {
    const hash = window.location.hash;
    console.log("AuthRedirect: URL hash:", hash);
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); 
      const id_token = params.get('id_token');
      if (id_token) {
        try {
          const decodedClaims = jwt_decode(id_token);
          console.log("Decoded JWT claims:", decodedClaims);
          setUser(decodedClaims);
          window.location.hash = '';
          navigation.navigate('Home');
        } catch (error) {
          console.error("Error decoding token:", error);
          navigation.navigate('LogIn');
        }
      } else {
        navigation.navigate('LogIn');
      }
    } else {
      navigation.navigate('LogIn');
    }
  }, [navigation, setUser]);

  return null;
}
