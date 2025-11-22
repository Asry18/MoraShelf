import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async Thunk to load user from storage on app start
export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_session');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load user", e);
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: true, // Start loading to check for existing session
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      // Persist to storage
      AsyncStorage.setItem('@user_session', JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoading = false;
      // Remove from storage
      AsyncStorage.removeItem('@user_session');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
  },
});

export const { loginSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;