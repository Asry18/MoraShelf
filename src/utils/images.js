// Image utility functions

/**
 * Get placeholder image URL or require local asset
 * Returns a placeholder image that can be used as fallback
 */
export const getPlaceholderImage = () => {
    // For React Native, we'll use a simple data URI or handle it in the component
    // This is a transparent placeholder that can be styled
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';
};

/**
 * Check if image URL is valid
 */
export const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Get default book cover dimensions
 */
export const BOOK_COVER_SIZES = {
    SMALL: { width: 60, height: 90 },
    MEDIUM: { width: 120, height: 180 },
    LARGE: { width: 180, height: 270 },
};

