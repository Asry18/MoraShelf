import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { getCoverUrl, PLACEHOLDER_COVER } from '../../services/api';

export default function BookCard({ book, onPress }) {
  const { theme, isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const imageSource = imageError || !coverUrl 
    ? { uri: PLACEHOLDER_COVER } 
    : { uri: coverUrl };
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Image 
        source={imageSource}
        style={[styles.cover, { backgroundColor: theme.border }]}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{book.title}</Text>
        <Text style={[styles.author, { color: theme.textSub }]} numberOfLines={1}>
          {book.author_name ? book.author_name[0] : 'Unknown Author'}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.year, { color: theme.primary, backgroundColor: isDark ? theme.surface : '#FFF5F5' }]}>
            {book.first_publish_year || 'N/A'}
          </Text>
          <Feather name="chevron-right" size={16} color={theme.textSub} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 0,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  }
});