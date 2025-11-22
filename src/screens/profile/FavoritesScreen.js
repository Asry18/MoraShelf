import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import BookCard from '../../components/specific/BookCard';
import { useTheme } from '../../theme/ThemeContext'; // Import Hook

export default function FavoritesScreen({ navigation }) {
  const favorites = useSelector(state => state.favorites.items);
  const { theme } = useTheme(); // Get Theme

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No favorites yet.</Text>
          <Text style={[styles.subText, { color: theme.textSub }]}>Start exploring and save books for later!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <BookCard 
              book={item} 
              onPress={() => navigation.navigate('BookDetails', { book: item })} 
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subText: { fontSize: 14, textAlign: 'center' },
});