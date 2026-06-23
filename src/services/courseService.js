import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/endpoints';

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_ALL);
      return response.data; // should contain { role, courses: [...] } based on backend
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },
  
  startCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.COURSES.START(courseId));
      return response.data?.progress;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start course');
    }
  },

  getCourseDetails: async (courseId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId));
      return response.data; // should contain { modules: [...], myProgress: {...} }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course details');
    }
  },

  getModuleDetails: async (courseId, moduleId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_MODULE(courseId, moduleId));
      return response.data?.module;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch module details');
    }
  }
};
