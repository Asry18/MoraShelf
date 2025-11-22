import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://openlibrary.org';
const AUTH_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
});

// Key for storing registered users locally
const REGISTERED_USERS_KEY = '@registered_users';

export const searchBooks = async (query, limit = 20) => {
  try {
    // The OpenLibrary search endpoint
    // Note: OpenLibrary API doesn't support 'fields' parameter - it returns all fields
    const response = await api.get(`/search.json`, {
      params: {
        q: query,
        limit: limit,
      }
    });
    // Extract only the fields we need from the response
    if (response.data && response.data.docs) {
      return response.data.docs.map(doc => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
        cover_i: doc.cover_i,
        first_publish_year: doc.first_publish_year,
      }));
    }
    return [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper to get high-res cover image
export const getCoverUrl = (coverId, size = 'M') => {
  if (coverId) {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
  // Return null for missing covers - components will handle fallback
  return null;
};

// Placeholder image data URI for books without covers
export const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';

// Helper function to get registered users from local storage
const getRegisteredUsers = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to get registered users', e);
    return {};
  }
};

// Helper function to save registered user to local storage
const saveRegisteredUser = async (email, userData) => {
  try {
    const users = await getRegisteredUsers();
    users[email.toLowerCase()] = userData;
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered user', e);
  }
};

// Authentication API functions using dummyjson.com
export const loginUser = async (email, password) => {
  try {
    // First, try to login via dummyjson API (for pre-existing users)
    try {
      const response = await authApi.post('/auth/login', {
        username: email, // Using email as username
        password: password,
      });

      if (response.data && response.data.token) {
        // Transform the response to match our app's user structure
        return {
          id: response.data.id,
          name: response.data.firstName + ' ' + response.data.lastName,
          email: email, // Use the email provided
          username: response.data.username,
          token: response.data.token,
        };
      }
    } catch (apiError) {
      // If API login fails, check local storage for registered users
      const registeredUsers = await getRegisteredUsers();
      const userKey = email.toLowerCase();
      
      if (registeredUsers[userKey]) {
        const localUser = registeredUsers[userKey];
        // Verify password matches
        if (localUser.password === password) {
          return {
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            username: localUser.username || localUser.email,
            token: localUser.token,
          };
        }
      }
      
      // If not found in local storage either, throw the original API error
      throw apiError;
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400 || error.response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response.data?.message || 'Login failed. Please try again.');
    } else if (error.request) {
      // Request was made but no response received - check local storage
      const registeredUsers = await getRegisteredUsers();
      const userKey = email.toLowerCase();
      
      if (registeredUsers[userKey]) {
        const localUser = registeredUsers[userKey];
        if (localUser.password === password) {
          return {
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            username: localUser.username || localUser.email,
            token: localUser.token,
          };
        }
      }
      
      throw new Error('Network error. Please check your connection.');
    } else {
      // Error in setting up the request
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

export const registerUser = async (name, email, password) => {
  try {
    // Check if user already exists in local storage
    const registeredUsers = await getRegisteredUsers();
    const userKey = email.toLowerCase();
    
    if (registeredUsers[userKey]) {
      throw new Error('Email already exists');
    }

    // Split name into first and last name for dummyjson API
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Try to register via dummyjson API (this is just for API call, won't persist)
    let userId = Date.now(); // Generate a unique ID
    try {
      const response = await authApi.post('/users/add', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: email, // Use email as username
        password: password,
      });
      
      if (response.data && response.data.id) {
        userId = response.data.id;
      }
    } catch (apiError) {
      // If API call fails, we'll still create the user locally
      console.log('API registration failed, creating user locally:', apiError.message);
    }

    // Create user object with a mock token (since dummyjson doesn't persist new users)
    const user = {
      id: userId,
      name: name,
      email: email.toLowerCase(),
      username: email.toLowerCase(),
      password: password, // Store password for local verification
      token: `mock-token-${userId}-${Date.now()}`, // Generate a mock token
    };

    // Save user to local storage
    await saveRegisteredUser(email, user);

    // Return user without password for security
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: user.token,
    };
  } catch (error) {
    if (error.message === 'Email already exists') {
      throw error;
    }
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400) {
        throw new Error('Email already exists or invalid data');
      }
      throw new Error(error.response.data?.message || 'Registration failed. Please try again.');
    } else if (error.request) {
      // Request was made but no response received - still create user locally
      const userId = Date.now();
      const user = {
        id: userId,
        name: name,
        email: email.toLowerCase(),
        username: email.toLowerCase(),
        password: password,
        token: `mock-token-${userId}-${Date.now()}`,
      };
      
      await saveRegisteredUser(email, user);
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: user.token,
      };
    } else {
      // Error in setting up the request
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};