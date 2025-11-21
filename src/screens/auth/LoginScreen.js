import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      {/* Temporary button to simulate login */}
      <Button title="Simulate Login" color={colors.primary} onPress={() => alert('Logic coming in Phase 3')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 20 }
});