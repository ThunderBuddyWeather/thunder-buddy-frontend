import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFriendRequests, useUpdateFriendRequest } from '../queries';
import { useAppContext } from '../context/AppContext';

export default function Notifications() {
  const { user, BASE_URL, authToken } = useAppContext();
  const username = user ? user.nickname || user.name : null;
  const {
    data: requests,
    isLoading,
    error,
  } = useFriendRequests(username, BASE_URL, authToken);
  const { acceptMutation, rejectMutation } = useUpdateFriendRequest(
    BASE_URL,
    authToken
  );

  const handleAccept = request => {
    acceptMutation.mutate({
      senderUsername: request.senderUsername,
      friendUsername: request.friendUsername,
    });
  };

  const handleReject = request => {
    rejectMutation.mutate({
      senderUsername: request.senderUsername,
      friendUsername: request.friendUsername,
    });
  };

  if (isLoading)
    return (
      <SafeAreaView>
        <Text style={styles.loading}>Loading friend requests...</Text>
      </SafeAreaView>
    );
  if (error)
    return (
      <SafeAreaView>
        <Text style={styles.error}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  if (!requests || requests.length === 0)
    return (
      <SafeAreaView>
        <Text style={styles.empty}>All caught up!</Text>
      </SafeAreaView>
    );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>
        {item.senderUsername} has sent you a friend request.
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAccept(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={item => `${item.senderUsername}_${item.friendUsername}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 16,
  },
});
