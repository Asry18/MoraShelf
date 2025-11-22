import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

export default function EmptyState({ icon = 'inbox', title = 'No items', subtitle, style }) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <Feather name={icon} size={64} color={theme.textSub} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSub }]}>{subtitle}</Text>
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
    minHeight: 300
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16
  }
});

