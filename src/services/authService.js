import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/endpoints';

/**
 * Authentication API Service
 * Wraps all auth-related endpoints inside try/catch blocks.
 */
export const authService = {
  login: async (credentials) => {
    try {
      // Data is unpacked automatically by the response interceptor
      const data = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    } catch (error) {
      // Extract nice error message from the backend structure if it exists
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    try {
      const data = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  }
};
