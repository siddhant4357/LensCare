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
  
  // Append images - fix the field name issue
  if (frameData.images && frameData.images.length) {
    // Make sure each file is appended with the exact field name 'images'
    frameData.images.forEach(img => {
      if (img.file instanceof File) {
        formData.append('images', img.file);
      } else {
        console.error('Invalid file object:', img);
      }
    });
  }
  
  const response = await api.post('/frames', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getFrames = async (page = 1, limit = 9, brand = '', prioritySort = false) => {
  try {
    const response = await api.get(
      `/frames?page=${page}&limit=${limit}&brand=${brand}`, { params: { prioritySort } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
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

export const updateFramePriority = async (id, priority) => {
  try {
    // Ensure priority is a number
    const priorityNum = Number(priority);
    
    // Use explicit content-type header to prevent multer from trying to parse as multipart
    const { data } = await api.put(`/frames/${id}/priority`, 
      { priority: priorityNum },
      { headers: { 'Content-Type': 'application/json' }}
    );
    
    return data;
  } catch (error) {
    console.error('Priority update error details:', error.response?.data || error.message);
    throw error.response ? error.response.data : new Error('Error updating priority');
  }
};