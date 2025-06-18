import api from './api';

export const createNotification = async (notificationData) => {
  const response = await api.post('/notifications', notificationData);
  return response.data;
};

export const getUserNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}`);
  return response.data;
};