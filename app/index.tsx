import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View testID="index-container" style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
