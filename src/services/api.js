import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

const api = axios.create({
  baseURL: BASE_URL,
});

export const searchBooks = async (query, limit = 20) => {
  try {
    // The OpenLibrary search endpoint
    const response = await api.get(`/search.json`, {
      params: {
        q: query,
        limit: limit,
        fields: 'key,title,author_name,cover_i,first_publish_year' // optimize payload
      }
    });
    return response.data.docs;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper to get high-res cover image
export const getCoverUrl = (coverId, size = 'M') => {
  return coverId 
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` 
    : 'https://via.placeholder.com/150x200?text=No+Cover'; 
};