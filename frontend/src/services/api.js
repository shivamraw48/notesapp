import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Error handler
const handleError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};

// Auth APIs
export const authAPI = {
  register: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/register', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/api/logout');
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },
};

// Notes APIs
export const notesAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/home');
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  create: async (text, tags = []) => {
    try {
      const response = await axiosInstance.post('/home', { text, tags });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  update: async (id, text, tags = []) => {
    try {
      const response = await axiosInstance.put(`/home/${id}`, { text, tags });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/home/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error));
    }
  },
};

export default axiosInstance;
