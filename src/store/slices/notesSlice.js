import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_book_notes';

// Load notes from storage
export const loadNotes = createAsyncThunk('notes/load', async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to load notes:', e);
    return {};
  }
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items: {}, // { bookKey: { text: string, updatedAt: timestamp } }
  },
  reducers: {
    addOrUpdateNote: (state, action) => {
      const { bookKey, text } = action.payload;
      state.items[bookKey] = {
        text,
        updatedAt: new Date().toISOString(),
      };
      // Persist to storage
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    deleteNote: (state, action) => {
      const bookKey = action.payload;
      delete state.items[bookKey];
      // Persist to storage
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadNotes.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addOrUpdateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;

