import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../../services/api';

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

// Async Thunk for user login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await loginUser(email, password);
      // Persist to storage
      await AsyncStorage.setItem('@user_session', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async Thunk for user registration
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const user = await registerUser(name, email, password);
      // Persist to storage if token is available
      if (user.token) {
        await AsyncStorage.setItem('@user_session', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: true, // Start loading to check for existing session
    isAuthenticating: false, // For login/register operations
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      // Remove from storage
      AsyncStorage.removeItem('@user_session');
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user cases
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticating = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticating = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logoutUser } = authSlice.actions;
export default authSlice.reducer;