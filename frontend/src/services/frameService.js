// frontend/src/services/frameService.js
import api from './api';

export const uploadFrame = async (frameData) => {
  const formData = new FormData();
  
  // Append text fields
  for (const key in frameData) {
    if (key !== 'images' && key !== 'colors') {
      formData.append(key, frameData[key]);
    }
  }
  
  // Append colors as JSON string
  formData.append('colors', JSON.stringify(frameData.colors.filter(c => c.selected)));
  
  // Append images
  if (frameData.images && frameData.images.length) {
    frameData.images.forEach(img => {
      formData.append('images', img.file);
    });
  }
  
  const response = await api.post('/frames', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getFrames = async () => {
  const response = await api.get('/frames');
  return response.data;
};

export const getFrameById = async (id) => {
  try {
    const response = await api.get(`/frames/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching frame by ID:', error);
    throw error;
  }
};

export const deleteFrame = async (id) => {
  const response = await api.delete(`/frames/${id}`);
  return response.data;
};

export const addFrameReview = async (frameId, review) => {
  const response = await api.post(`/frames/${frameId}/reviews`, review);
  return response.data;
};

export const createFrame = async (frameData) => {
  const response = await api.post('/frames', frameData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};