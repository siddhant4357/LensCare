/**
 * Returns the correct URL for images based on environment
 * @param {string} path - The image path from the backend
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  
  // If path is already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // Use environment variable or fallback to relative path
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${path}`;
};