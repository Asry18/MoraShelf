import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { getCoverUrl } from '../../services/api';
import { toggleFavorite } from '../../store/slices/favoritesSlice';

export default function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params;
  const dispatch = useDispatch();
  
  // Check if book is already in favorites
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(item => item.key === book.key);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(book));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: getCoverUrl(book.cover_i, 'L') }} 
          style={styles.cover}
          resizeMode="contain"
        />
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{book.title}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favButton}>
            <Feather 
              name="heart" 
              size={28} 
              color={isFavorite ? colors.error : colors.textLight} 
              style={isFavorite ? { fill: colors.error } : {}} // Fill if active (won't work directly on Feather but color changes)
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.author}>by {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</Text>
        
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Published: {book.first_publish_year}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#E3F2FD' }]}>
             {/* Show reading logic could go here */}
            <Text style={[styles.badgeText, { color: '#1565C0' }]}>Education</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          This is a placeholder description because the search API endpoint doesn't always return the full text synopsis. 
          Imagine a great summary of "{book.title}" here, perfect for a UoM student doing research!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: {
    backgroundColor: '#F5F5F5',
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
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, flex: 1, marginRight: 10 },
  author: { fontSize: 16, color: colors.textLight, marginTop: 8, fontStyle: 'italic' },
  badgeRow: { flexDirection: 'row', marginTop: 16 },
  badge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  badgeText: { fontSize: 12, color: '#E65100', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 24, color: colors.textLight },
});