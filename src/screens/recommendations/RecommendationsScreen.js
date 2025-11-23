import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { getRecommendations } from '../../services/api';
import BookCard from '../../components/specific/BookCard';

export default function RecommendationsScreen({ navigation }) {
  const favorites = useSelector(state => state.favorites.items);
  const recentlyViewed = useSelector(state => state.recentlyViewed.items);
  const { theme, isDark } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async (showError = true) => {
    try {
      setError(null);
      // Collect unique authors from favorites and recently viewed
      const authorsSet = new Set();
      [...favorites, ...recentlyViewed].forEach(book => {
        if (book.author_name && Array.isArray(book.author_name)) {
          book.author_name.forEach(author => authorsSet.add(author));
        }
      });
      const authors = Array.from(authorsSet);

      if (authors.length === 0) {
        setBooks([]);
        if (showError) {
          setError('Add some favorites or view books to get recommendations.');
        }
        return;
      }

      // Collect keys to exclude (already favorited or viewed)
      const excludeKeys = new Set([...favorites, ...recentlyViewed].map(book => book.key));

      const data = await getRecommendations(authors, Array.from(excludeKeys));
      setBooks(data || []);
      if ((!data || data.length === 0) && showError) {
        setError('No recommendations found. Try adding more favorites.');
      }
    } catch (error) {
      console.error('Fetch recommendations error:', error);
      setError('Failed to fetch recommendations. Please check your connection and try again.');
      if (showError) {
        Alert.alert('Error', 'Failed to fetch recommendations. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [favorites, recentlyViewed]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecommendations(false);
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const renderEmptyState = useCallback(() => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Feather name="book-open" size={64} color={theme.textSub} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No recommendations yet</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSub }]}>
          {error || 'Add some favorites or browse books to get personalized recommendations.'}
        </Text>
      </View>
    );
  }, [loading, theme, error]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Recommended for You</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>
          Books based on your favorites and recently viewed
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 10, color: theme.textSub }}>Finding recommendations...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate('BookDetails', { book: item })}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            books.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 0
  },
  emptyListContent: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingHorizontal: 16
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  }
});