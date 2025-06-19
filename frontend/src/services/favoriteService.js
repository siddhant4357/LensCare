import api from './api';

export const getFavorites = async () => {
  const response = await api.get('/user/favorites');
  return response.data;
};

export const addToFavorites = async (productId) => {
  const response = await api.post('/user/favorites', { productId });
  return response.data;
};

export const removeFavorite = async (favoriteId) => {
  const response = await api.delete(`/user/favorites/${favoriteId}`);
  return response.data;
};