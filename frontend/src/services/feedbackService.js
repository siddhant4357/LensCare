import api from './api';

export const addFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getApprovedFeedback = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

export const getAllFeedback = async () => {
  const response = await api.get('/feedback/admin');
  return response.data;
};

export const approveFeedback = async (id) => {
  const response = await api.put(`/feedback/${id}/approve`);
  return response.data;
};