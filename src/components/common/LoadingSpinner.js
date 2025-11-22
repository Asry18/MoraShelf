import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function LoadingSpinner({ message = 'Loading...', size = 'large' }) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.textSub }]}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
  },
});

