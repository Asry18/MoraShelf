import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';
import notesReducer from './slices/notesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    recentlyViewed: recentlyViewedReducer,
    notes: notesReducer,
  },
  // Middleware setup is handled automatically by Redux Toolkit
});