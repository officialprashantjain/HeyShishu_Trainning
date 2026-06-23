import axios from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Creating a unified Axios instance.
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // Optional: 10 seconds timeout
});

/**
 * Request Interceptor
 * Runs BEFORE every request is sent.
 * Use this to attached the saved JWT token.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Runs BEFORE the response reaches the component.
 * Use this for global error handling (e.g. Logging out if token expires).
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data
    return response.data;
  },
  (error) => {
    // Global Error Handling
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Token has expired or is invalid
        console.warn('Unauthorized! Logging out user...');
        storage.clearAll();
        // Redirect to login if running in browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login'; 
        }
      } else if (status === 403) {
        console.error('Forbidden access');
      } else if (status >= 500) {
        console.error('Server error occurred');
      }
    } else if (error.request) {
      console.error('No response received from server', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
