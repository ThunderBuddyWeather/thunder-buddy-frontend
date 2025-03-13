import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, SafeAreaView, View } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function ContactSearch() {
  const { user } = useAppContext();
  const [friendCode, setFriendCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, pending, success, error
  const [serverMessage, setServerMessage] = useState(null);

  const handleSendRequest = async () => {
    if (!friendCode.trim()) return;
    if (!user) {
      setServerMessage('No logged-in user found.');
      return;
    }

    setStatus('pending');
    setServerMessage(null);
    
    try {
      const currentUsername = user.nickname || user.name;
      const url = `http://127.0.0.1:5000/api/friendship/request/${currentUsername}+${friendCode}`;
      
      const response = await fetch(url, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setServerMessage(data.message || 'Friend request sent!');
      } else {
        setStatus('error');
        setServerMessage(data.message || 'Failed to send friend request');
      }
    } catch (err) {
      setStatus('error');
      setServerMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={friendCode}
          onChangeText={setFriendCode}
          onSubmitEditing={handleSendRequest}
          returnKeyType="send"
        />
        {status === 'success' && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {serverMessage && (
        <Text style={[styles.serverMessage, status === 'error' && styles.error]}>
          {serverMessage}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 8,
    width: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  },
  checkmark: {
    marginLeft: 8,
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold',
  },
  serverMessage: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
});
