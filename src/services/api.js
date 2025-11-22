import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

const api = axios.create({
  baseURL: BASE_URL,
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