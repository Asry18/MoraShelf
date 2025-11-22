import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { searchBooks } from '../../services/api';
import BookCard from '../../components/specific/BookCard';

export default function HomeScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('computer science'); // Default topic for UoM students

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const data = await searchBooks(query);
      setBooks(data);
    } catch (error) {
      alert('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello, {user?.name || 'Student'} 👋</Text>
      <Text style={styles.subGreeting}>What are you learning today?</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => fetchBooks(searchQuery)}
          returnKeyType="search"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.textLight }}>Loading Library...</Text>
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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
  subGreeting: { fontSize: 14, color: colors.textLight, marginBottom: 16 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: colors.text }
});