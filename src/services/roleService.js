import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/endpoints';

export const roleService = {
  /**
   * Fetches all active training roles (e.g. Nanny) from the admin API.
   * Path: /admin/training/roles
   */
  getRoles: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ROLES.GET_ALL);
      return response.data?.roles || response.roles || [];
    } catch (error) {
      console.error('Failed to fetch training roles:', error);
      // Return empty array instead of throwing to avoid breaking the UI completely on failure
      return []; 
    }
  }
};
