import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function ThemeToggle({ style }) {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.toggleButton, style]} 
      onPress={toggleTheme}
    >
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
