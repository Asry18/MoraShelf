import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { getCoverUrl } from '../../services/api';

export default function BookCard({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={{ uri: getCoverUrl(book.cover_i, 'M') }} 
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author_name ? book.author_name[0] : 'Unknown Author'}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.year}>{book.first_publish_year || 'N/A'}</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
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
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  }
});