import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookDetailsScreen({ route }) {
  // We will use route.params later to get the book ID
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Book Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});