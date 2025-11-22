import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getCoverUrl } from '../../services/api';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { useTheme } from '../../theme/ThemeContext'; // Import Hook

export default function BookDetailsScreen({ route }) {
  const { book } = route.params;
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme(); // Get Theme
  
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(item => item.key === book.key);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(book));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Image Background matches theme surface */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}>
        <Image 
          source={{ uri: getCoverUrl(book.cover_i, 'L') }} 
          style={styles.cover}
          resizeMode="contain"
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>{book.title}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favButton}>
            <Feather 
              name="heart" 
              size={28} 
              color={isFavorite ? (theme.error || 'red') : theme.textSub} 
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.author, { color: theme.textSub }]}>
          by {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
        </Text>
        
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: isDark ? '#333' : '#FFF3E0' }]}>
            <Text style={[styles.badgeText, { color: isDark ? theme.primary : '#E65100' }]}>
              Published: {book.first_publish_year}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
        <Text style={[styles.description, { color: theme.textSub }]}>
          This is a placeholder description because the search API endpoint doesn't always return the full text synopsis. 
          Imagine a great summary of "{book.title}" here, perfect for a UoM student doing research!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cover: {
    width: 180,
    height: 270,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  detailsContainer: { padding: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 10 },
  author: { fontSize: 16, marginTop: 8, fontStyle: 'italic' },
  badgeRow: { flexDirection: 'row', marginTop: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 24 },
});