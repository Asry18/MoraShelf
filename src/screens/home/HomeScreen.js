import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { searchBooks } from '../../services/api';
import BookCard from '../../components/specific/BookCard';

export default function HomeScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const recentlyViewed = useSelector(state => state.recentlyViewed.items);
  const { theme, isDark, toggleTheme } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('computer science'); // Default topic for UoM students
  const [selectedCategory, setSelectedCategory] = useState('computer science');
  const debounceTimer = useRef(null);
  
  const categories = [
    { id: 'computer science', label: 'Computer Science', icon: 'cpu' },
    { id: 'engineering', label: 'Engineering', icon: 'tool' },
    { id: 'mathematics', label: 'Mathematics', icon: 'hash' },
    { id: 'physics', label: 'Physics', icon: 'zap' },
    { id: 'chemistry', label: 'Chemistry', icon: 'droplet' },
    { id: 'business', label: 'Business', icon: 'briefcase' },
  ];

  const fetchBooks = async (query, showError = true) => {
    try {
      setError(null);
      const data = await searchBooks(query);
      setBooks(data || []);
      if ((!data || data.length === 0) && showError) {
        setError('No books found. Try a different search term.');
      }
    } catch (error) {
      console.error('Fetch books error:', error);
      setError('Failed to fetch books. Please check your connection and try again.');
      if (showError) {
        Alert.alert('Error', 'Failed to fetch books. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Debounced search function
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setSelectedCategory(null); // Clear category when user types
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        setLoading(true);
        fetchBooks(text.trim());
      } else if (text.trim().length === 0) {
        // Reset to default search if empty
        setSelectedCategory('computer science');
        setLoading(true);
        fetchBooks('computer science');
      }
    }, 500); // 500ms delay
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    setSearchQuery(category.id);
    setLoading(true);
    fetchBooks(category.id);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBooks(searchQuery, false);
  }, [searchQuery]);

  useEffect(() => {
    fetchBooks(searchQuery);
    
    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const renderRecentlyViewed = () => {
    if (recentlyViewed.length === 0) return null;
    
    return (
      <View style={styles.recentlyViewedSection}>
        <View style={styles.sectionHeader}>
          <Feather name="clock" size={18} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recently Viewed</Text>
        </View>
        <FlatList
          data={recentlyViewed.slice(0, 5)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <BookCard 
              book={item} 
              onPress={() => navigation.navigate('BookDetails', { book: item })} 
            />
          )}
          contentContainerStyle={styles.horizontalList}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.headerTop}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hello, {user?.name || 'Student'} 👋</Text>
          <Text style={[styles.subGreeting, { color: theme.textSub }]}>What are you learning today?</Text>
        </View>
        <TouchableOpacity 
          onPress={toggleTheme} 
          style={[styles.themeToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Feather name={isDark ? 'sun' : 'moon'} size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Feather name="search" size={20} color={theme.textSub} style={styles.searchIcon} />
        <TextInput 
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search books..."
          placeholderTextColor={theme.textSub}
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={() => {
            if (searchQuery.trim().length >= 2) {
              setLoading(true);
              fetchBooks(searchQuery.trim());
            }
          }}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setSearchQuery('');
              setLoading(true);
              fetchBooks('computer science');
            }}
            style={styles.clearButton}
          >
            <Feather name="x" size={18} color={theme.textSub} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.error + '20', borderColor: theme.error }]}>
          <Feather name="alert-circle" size={16} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      )}
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={[styles.categoriesTitle, { color: theme.text }]}>Popular Categories</Text>
        <View style={styles.categoriesList}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderColor: isSelected ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Feather 
                  name={category.icon} 
                  size={14} 
                  color={isSelected ? theme.white : theme.textSub} 
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isSelected ? theme.white : theme.text }
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Recently Viewed Section */}
      {renderRecentlyViewed()}
    </View>
  );

  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Feather name="book-open" size={64} color={theme.textSub} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No books found</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSub }]}>
          {error || 'Try searching for a different topic or check your connection.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 10, color: theme.textSub }}>Loading Library...</Text>
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
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            books.length === 0 
              ? styles.emptyListContent 
              : styles.listContent
          }
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
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
    paddingBottom: 100, // Extra padding to ensure all content is visible above tab bar
    paddingTop: 0
  },
  emptyListContent: { 
    flexGrow: 1, 
    paddingBottom: 100, 
    paddingHorizontal: 16 
  },
  header: { marginBottom: 20, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 16 
  },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: 22, fontWeight: 'bold' },
  subGreeting: { fontSize: 14, marginTop: 4 },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginLeft: 12
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  clearButton: {
    padding: 4,
    marginLeft: 8
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1
  },
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
  },
  recentlyViewedSection: {
    marginTop: 24,
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  horizontalList: {
    paddingRight: 16,
    paddingLeft: 0
  },
  categoriesContainer: {
    marginTop: 24,
    marginBottom: 16
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8
  },
  categoryIcon: {
    marginRight: 6
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500'
  }
});