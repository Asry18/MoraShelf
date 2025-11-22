import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_RECENT_ITEMS = 15;
const STORAGE_KEY = '@user_recently_viewed';

// Load recently viewed from storage
export const loadRecentlyViewed = createAsyncThunk('recentlyViewed/load', async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load recently viewed:', e);
    return [];
  }
});

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: {
    items: [],
  },
  reducers: {
    addToRecentlyViewed: (state, action) => {
      const book = action.payload;
      
      // Remove if already exists
      const existingIndex = state.items.findIndex((item) => item.key === book.key);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      }
      
      // Add to beginning
      state.items.unshift(book);
      
      // Limit to MAX_RECENT_ITEMS
      if (state.items.length > MAX_RECENT_ITEMS) {
        state.items = state.items.slice(0, MAX_RECENT_ITEMS);
      }
      
      // Persist to storage
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      AsyncStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadRecentlyViewed.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addToRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;

