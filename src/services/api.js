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

export const getRecommendations = async (authors, excludeKeys = [], limit = 10) => {
  try {
    const recommendations = [];
    const seenKeys = new Set(excludeKeys);

    // For each author, search for books by that author
    for (const author of authors.slice(0, 5)) { // Limit to first 5 authors to avoid too many calls
      try {
        const response = await api.get(`/search.json`, {
          params: {
            q: `author:"${author}"`,
            limit: 5, // Get 5 books per author
          }
        });

        if (response.data && response.data.docs) {
          for (const doc of response.data.docs) {
            if (!seenKeys.has(doc.key) && recommendations.length < limit) {
              recommendations.push({
                key: doc.key,
                title: doc.title,
                author_name: doc.author_name,
                cover_i: doc.cover_i,
                first_publish_year: doc.first_publish_year,
              });
              seenKeys.add(doc.key);
            }
          }
        }
      } catch (authorError) {
        console.warn(`Failed to get recommendations for author ${author}:`, authorError.message);
        // Continue with next author
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Recommendations API Error:', error);
    throw error;
  }
};
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

// Helper function to find user by email in dummyjson users
const findUserByEmail = async (email) => {
  try {
    // Try search endpoint first
    try {
      const searchResponse = await authApi.get('/users/search', {
        params: {
          q: email,
        },
      });

      if (searchResponse.data && searchResponse.data.users && searchResponse.data.users.length > 0) {
        // Find exact email match (case insensitive)
        const user = searchResponse.data.users.find(
          u => u.email && u.email.toLowerCase() === email.toLowerCase()
        );
        if (user) return user;
      }
    } catch (searchError) {
      // Search endpoint might not work, try filter endpoint
      try {
        const filterResponse = await authApi.get('/users/filter', {
          params: {
            key: 'email',
            value: email,
          },
        });

        if (filterResponse.data && filterResponse.data.users && filterResponse.data.users.length > 0) {
          const user = filterResponse.data.users.find(
            u => u.email && u.email.toLowerCase() === email.toLowerCase()
          );
          if (user) return user;
        }
      } catch (filterError) {
        // Filter also failed, try fetching users and searching
        // Fetch a reasonable number of users (limit to 100 for performance)
        const usersResponse = await authApi.get('/users', {
          params: {
            limit: 100,
          },
        });

        if (usersResponse.data && usersResponse.data.users) {
          const user = usersResponse.data.users.find(
            u => u.email && u.email.toLowerCase() === email.toLowerCase()
          );
          if (user) return user;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error searching for user by email:', error);
    return null;
  }
};

// Helper function to check if input looks like an email
const isEmail = (input) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
};

// Authentication API functions using dummyjson.com
// Accepts either email or username
export const loginUser = async (emailOrUsername, password) => {
  try {
    // STEP 1: First check local registered users by email
    const registeredUsers = await getRegisteredUsers();
    const userKey = emailOrUsername.toLowerCase();

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
      } else {
        // Password doesn't match for local user
        throw new Error('Invalid email/username or password');
      }
    }

    // STEP 2: If not found locally, try dummyjson API with input as username
    try {
      const response = await authApi.post('/auth/login', {
        username: emailOrUsername, // Try input as username
        password: password,
      });

      if (response.data && (response.data.accessToken || response.data.token)) {
        // Construct name from firstName and lastName (handle missing lastName)
        const firstName = response.data.firstName || '';
        const lastName = response.data.lastName || '';
        const fullName = lastName ? `${firstName} ${lastName}` : firstName;

        // Transform the response to match our app's user structure
        return {
          id: response.data.id,
          name: fullName,
          email: response.data.email || (isEmail(emailOrUsername) ? emailOrUsername : ''),
          username: response.data.username,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          gender: response.data.gender,
          image: response.data.image,
          accessToken: response.data.accessToken || response.data.token,
          refreshToken: response.data.refreshToken,
          token: response.data.accessToken || response.data.token, // Keep for backward compatibility
        };
      }
    } catch (apiError) {
      // STEP 3: If login with input as username fails, and input looks like an email,
      // try to find the user by email in dummyjson and login with their actual username
      if (apiError.response && (apiError.response.status === 400 || apiError.response.status === 401)) {
        if (isEmail(emailOrUsername)) {
          try {
            // Find user by email to get their username
            const user = await findUserByEmail(emailOrUsername);

            if (user && user.username) {
              // Try login with the actual username
              const loginResponse = await authApi.post('/auth/login', {
                username: user.username,
                password: password,
              });

              if (loginResponse.data && (loginResponse.data.accessToken || loginResponse.data.token)) {
                // Construct name from firstName and lastName (handle missing lastName)
                const firstName = loginResponse.data.firstName || user.firstName || '';
                const lastName = loginResponse.data.lastName || user.lastName || '';
                const fullName = lastName ? `${firstName} ${lastName}` : firstName;

                return {
                  id: loginResponse.data.id || user.id,
                  name: fullName,
                  email: loginResponse.data.email || user.email || emailOrUsername,
                  username: loginResponse.data.username || user.username,
                  firstName: loginResponse.data.firstName || user.firstName,
                  lastName: loginResponse.data.lastName || user.lastName,
                  gender: loginResponse.data.gender || user.gender,
                  image: loginResponse.data.image || user.image,
                  accessToken: loginResponse.data.accessToken || loginResponse.data.token,
                  refreshToken: loginResponse.data.refreshToken,
                  token: loginResponse.data.accessToken || loginResponse.data.token, // Keep for backward compatibility
                };
              }
            }
          } catch (usernameLoginError) {
            // If username login also fails, throw error
            console.log('Username-based login failed');
          }
        }
      }

      // If all attempts failed, throw the error
      throw apiError;
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    if (error.message === 'Invalid email or password' || error.message === 'Invalid email or username') {
      throw error;
    }
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 400 || error.response.status === 401) {
        throw new Error('Invalid email/username or password');
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