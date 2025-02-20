import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserContext.jsx';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const { username, setUsername } = useUser();
  const navigation = useNavigation(); 

  const handleLogIn = () => {
    navigation.navigate('LogIn');
  };

  const handleLogOut = () => {
    setUsername(null); 
    navigation.navigate('Home'); 
  };

  const navigateWeather = () => {
    navigation.navigate('Weather'); 
  };

  const LogIn = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          onPress={handleLogIn}
          className="bg-blue-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Log In</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={handleLogIn}
        style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, minHeight: 50 }}
        labelStyle={{ fontSize: 16, textAlign: 'center', color: 'white' }}
      >
        Log In
      </Button>
    );
  };

  const LogOut = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          onPress={handleLogOut}
          className="bg-red-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Log Out</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={handleLogOut}
        style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, minHeight: 50 }}
        labelStyle={{ fontSize: 16, textAlign: 'center', color: 'white' }}
      >
        Log Out
      </Button>
    );
  };

  const Weather = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          onPress={navigateWeather}
          className="bg-blue-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Weather</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={navigateWeather}
        style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, minHeight: 50 }}
        labelStyle={{ fontSize: 16, textAlign: 'center', color: 'white' }}
      >
        Weather
      </Button>
    );
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ margin: 24, marginTop: 0, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
        {username ? `Welcome, ${username}!` : "Please log in!"}
        {'\n'}
        {username ? <LogOut /> : <LogIn />}
        {username ? <Weather /> : ''}
      </Text>
    </View>
  );
}
