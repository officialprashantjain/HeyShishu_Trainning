import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/endpoints';

const unwrapData = (response) =>
  response?.data ?? response?.payload ?? response;

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_ALL);
      return unwrapData(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },
  
  startCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.COURSES.START(courseId));
      return unwrapData(response)?.progress;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start course');
    }
  },

  updateCourseProgress: async (courseId, progressData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.COURSES.UPDATE_PROGRESS(courseId), progressData);
      return unwrapData(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update module progress');
    }
  },

  getCourseDetails: async (courseId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_ID(courseId));
      return unwrapData(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course details');
    }
  },

  getModuleDetails: async (courseId, moduleId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_MODULE(courseId, moduleId));
      return unwrapData(response)?.module ?? unwrapData(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch module details');
    }
  },

  submitModuleTest: async (moduleId, payload) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.TESTS.SUBMIT_MODULE(moduleId), payload);
      return unwrapData(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit module test');
    }
  },

  // Returns array of progress records for all videos in a course
  getCourseProgress: async (courseId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_PROGRESS(courseId));
      // Backend may return { data: [...] } or directly an array
      const raw = unwrapData(response);
      return Array.isArray(raw) ? raw : (raw?.progress ?? raw?.records ?? []);
    } catch (error) {
      // Non-fatal: return empty so pages degrade gracefully
      console.warn('getCourseProgress failed:', error.message);
      return [];
    }
  },

  // Heartbeat — silent fire-and-forget; never crashes the UI
  syncProgress: async (payload) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.COURSES.SYNC_PROGRESS, payload);
      return unwrapData(response);
    } catch (error) {
      console.warn('syncProgress heartbeat failed (non-fatal):', error.message);
      return null;
    }
  },

  requestReview: async () => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.TRAINEE.REQUEST_REVIEW);
      return unwrapData(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to request review');
    }
  },
};
