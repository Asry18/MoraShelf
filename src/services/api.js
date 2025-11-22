import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';
const AUTH_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
});

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

// Authentication API functions using dummyjson.com
export const loginUser = async (email, password) => {
  try {
    // DummyJSON login endpoint uses 'username' field, so we'll use email as username
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
    throw new Error('Invalid response from server');
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400 || error.response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response.data?.message || 'Login failed. Please try again.');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Error in setting up the request
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

export const registerUser = async (name, email, password) => {
  try {
    // Split name into first and last name for dummyjson API
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    // DummyJSON users/add endpoint for registration
    const response = await authApi.post('/users/add', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: email, // Use email as username
      password: password,
    });

    if (response.data && response.data.id) {
      // After successful registration, automatically log the user in
      // Note: DummyJSON doesn't return a token on registration, so we'll login immediately
      try {
        const loginResponse = await authApi.post('/auth/login', {
          username: email,
          password: password,
        });

        if (loginResponse.data && loginResponse.data.token) {
          return {
            id: loginResponse.data.id,
            name: name,
            email: email,
            username: loginResponse.data.username,
            token: loginResponse.data.token,
          };
        }
        // If login response doesn't have token, throw error
        throw new Error('Registration successful, but automatic login failed. Please login manually.');
      } catch (loginError) {
        // If auto-login fails, throw an error so user knows to login manually
        // This ensures they stay on login screen and can login with their new credentials
        throw new Error('Registration successful! Please login with your new account.');
      }
    }
    throw new Error('Invalid response from server');
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400) {
        throw new Error('Email already exists or invalid data');
      }
      throw new Error(error.response.data?.message || 'Registration failed. Please try again.');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Error in setting up the request
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};