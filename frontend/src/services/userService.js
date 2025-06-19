// frontend/src/services/userService.js
import api from './api';

// Make sure updateUserProfile is exported correctly
export const updateUserProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};