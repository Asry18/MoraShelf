import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Share, Alert, Platform, Vibration, TextInput, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getCoverUrl, PLACEHOLDER_COVER } from '../../services/api';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { addToRecentlyViewed } from '../../store/slices/recentlyViewedSlice';
import { addOrUpdateNote, deleteNote } from '../../store/slices/notesSlice';
import { useTheme } from '../../theme/ThemeContext'; // Import Hook

// Haptic feedback helper (with fallback to vibration)
const hapticFeedback = () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Vibration.vibrate(10); // 10ms vibration
  }
};

export default function BookDetailsScreen({ route }) {
  const { book } = route.params;
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme(); // Get Theme
  const [imageError, setImageError] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [notesText, setNotesText] = useState('');
  
  const favorites = useSelector(state => state.favorites.items);
  const notes = useSelector(state => state.notes.items);
  const isFavorite = favorites.some(item => item.key === book.key);
  const bookNote = notes[book.key];
  
  const coverUrl = getCoverUrl(book.cover_i, 'L');
  const imageSource = imageError || !coverUrl 
    ? { uri: PLACEHOLDER_COVER } 
    : { uri: coverUrl };

  // Load existing note when modal opens
  useEffect(() => {
    if (notesModalVisible && bookNote) {
      setNotesText(bookNote.text);
    } else if (notesModalVisible) {
      setNotesText('');
    }
  }, [notesModalVisible, bookNote]);

  // Track this book as recently viewed
  useEffect(() => {
    if (book) {
      dispatch(addToRecentlyViewed(book));
    }
  }, [book, dispatch]);

  const handleToggleFavorite = () => {
    hapticFeedback();
    dispatch(toggleFavorite(book));
  };

  const handleShare = async () => {
    try {
      const bookInfo = `📚 ${book.title || 'Untitled Book'}\n\n` +
        `by ${book.author_name && book.author_name.length > 0 ? book.author_name.join(', ') : 'Unknown Author'}\n` +
        `${book.first_publish_year ? `Published: ${book.first_publish_year}\n` : ''}` +
        `\nFound on MoraShelf - Your academic resource companion!`;
      
      const result = await Share.share({
        message: bookInfo,
        title: book.title || 'Book from MoraShelf',
      });

      if (result.action === Share.sharedAction) {
        hapticFeedback();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share book. Please try again.');
    }
  };

  const handleSaveNote = () => {
    if (notesText.trim()) {
      dispatch(addOrUpdateNote({ bookKey: book.key, text: notesText.trim() }));
      hapticFeedback();
      setNotesModalVisible(false);
    }
  };

  const handleDeleteNote = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteNote(book.key));
            setNotesModalVisible(false);
            hapticFeedback();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header Image Background matches theme surface */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}>
        <Image 
          source={imageSource}
          style={[styles.cover, { backgroundColor: theme.border }]}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]}>{book.title || 'Untitled Book'}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Feather name="share-2" size={24} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.actionButton}>
              <Feather 
                name={isFavorite ? "heart" : "heart"} 
                size={28} 
                fill={isFavorite ? (theme.error || 'red') : 'none'}
                color={isFavorite ? (theme.error || 'red') : theme.textSub} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.author, { color: theme.textSub }]}>
          by {book.author_name && book.author_name.length > 0 
            ? book.author_name.join(', ') 
            : 'Unknown Author'}
        </Text>
        
        <View style={styles.badgeRow}>
          {book.first_publish_year && (
            <View style={[styles.badge, { backgroundColor: isDark ? '#333' : '#FFF3E0' }]}>
              <Text style={[styles.badgeText, { color: isDark ? theme.primary : '#E65100' }]}>
                Published: {book.first_publish_year}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
        <Text style={[styles.description, { color: theme.textSub }]}>
          This is a placeholder description because the search API endpoint doesn't always return the full text synopsis. 
          Imagine a great summary of "{book.title}" here, perfect for a UoM student doing research!
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <View style={styles.notesHeaderLeft}>
              <Feather name="edit-3" size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8 }]}>Reading Notes</Text>
            </View>
            <TouchableOpacity
              onPress={() => setNotesModalVisible(true)}
              style={[styles.noteButton, { backgroundColor: theme.primary }]}
            >
              <Feather 
                name={bookNote ? "edit-2" : "plus"} 
                size={16} 
                color={isDark ? '#000' : '#FFF'} 
              />
              <Text style={[styles.noteButtonText, { color: isDark ? '#000' : '#FFF' }]}>
                {bookNote ? 'Edit' : 'Add'} Note
              </Text>
            </TouchableOpacity>
          </View>
          
          {bookNote ? (
            <TouchableOpacity
              onPress={() => setNotesModalVisible(true)}
              style={[styles.notePreview, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Text style={[styles.notePreviewText, { color: theme.text }]} numberOfLines={3}>
                {bookNote.text}
              </Text>
              {bookNote.updatedAt && (
                <Text style={[styles.noteDate, { color: theme.textSub }]}>
                  Updated {new Date(bookNote.updatedAt).toLocaleDateString()}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={[styles.noNoteText, { color: theme.textSub }]}>
              No notes yet. Tap "Add Note" to jot down your thoughts about this book.
            </Text>
          )}
        </View>
      </View>

      {/* Notes Modal */}
      <Modal
        visible={notesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Reading Notes</Text>
              <TouchableOpacity onPress={() => setNotesModalVisible(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.noteInput, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="Write your notes here..."
              placeholderTextColor={theme.textSub}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              value={notesText}
              onChangeText={setNotesText}
            />
            
            <View style={styles.modalActions}>
              {bookNote && (
                <TouchableOpacity
                  onPress={handleDeleteNote}
                  style={[styles.modalButton, { backgroundColor: theme.error + '20', borderColor: theme.error }]}
                >
                  <Feather name="trash-2" size={18} color={theme.error} />
                  <Text style={[styles.modalButtonText, { color: theme.error }]}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleSaveNote}
                style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: theme.primary }]}
              >
                <Feather name="check" size={18} color={isDark ? '#000' : '#FFF'} />
                <Text style={[styles.modalButtonText, { color: isDark ? '#000' : '#FFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionButton: { padding: 4 },
  author: { fontSize: 16, marginTop: 8, fontStyle: 'italic' },
  badgeRow: { flexDirection: 'row', marginTop: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 24 },
  notesSection: { marginTop: 8 },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  notesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  noteButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600'
  },
  notePreview: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8
  },
  notePreviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  noteDate: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  noNoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    fontSize: 16,
    marginBottom: 16
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1
  },
  modalButtonPrimary: {
    borderWidth: 0
  },
  modalButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600'
  }
});