import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load favorites from storage
export const loadFavorites = createAsyncThunk('favorites/loadFavorites', async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_favorites');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const book = action.payload;
      const existingIndex = state.items.findIndex((item) => item.key === book.key);

      if (existingIndex >= 0) {
        // Remove if exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        state.items.push(book);
      }
      
      // Persist updated list
      AsyncStorage.setItem('@user_favorites', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavorites.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;