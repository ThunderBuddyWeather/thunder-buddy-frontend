import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Button, TextInput, HelperText, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext.jsx';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/COLORS';

export default function LogIn() {
  const [username, setFormUsername] = useState('');
  const [password, setFormPassword] = useState('');
  const [usernameError, setFormUsernameError] = useState(false);
  const [passwordError, setFormPasswordError] = useState(false);
  const navigation = useNavigation();
  const { setUsername } = useUser();

  const handleLogin = async () => {
    if (!username || !password) {
      if (!username) setFormUsernameError(true);
      if (!password) setFormPasswordError(true);
      return;
    }
    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsername(username);
        navigation.navigate('Home');
        console.log('successfully logged in', data);
      } else {
        console.log('Login failed');
      }
    } catch (err) {
      console.log('Something went wrong. Please try again later.');
    } finally {
      // setLoading(false);
    }
  };

  const renderButton = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>
        <Text>Login</Text>
      </Title>
      <TextInput
        label="Username"
        value={username}
        onChangeText={text => setFormUsername(text)}
        mode="outlined"
        keyboardType="default"
        autoCapitalize="none"
        autoCompleteType="username"
        error={usernameError}
        style={styles.input}
      />
      {usernameError && (
        <HelperText type="error" visible={usernameError}>
          <Text>Username is required.</Text>
        </HelperText>
      )}

      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setFormPassword(text)}
        mode="outlined"
        secureTextEntry
        error={passwordError}
        style={styles.input}
      />
      {passwordError && (
        <HelperText type="error" visible={passwordError}>
          <Text>Password is required.</Text>
        </HelperText>
      )}
      {renderButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: 'Arial',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
});
