import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ComingSoonScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This feature is coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
});