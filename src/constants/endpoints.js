/**
 * Centralized list of API Endpoints.
 * Using a single source of truth prevents hardcoding URLs across the app.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/trainee/login',
    REGISTER: '/auth/trainee/register',
  },
  ROLES: {
    GET_ALL: '/admin/training/roles',
  },
  TRAINEE: {
    PROFILE: '/trainee/profile',
    UPDATE_PROFILE: '/trainee/profile/update',
    // Additional trainee specific endpoints...
  },
  PAYMENT: {
    INITIATE: '/trainee/payment/initiate',
    VERIFY: '/trainee/payment/verify',
  },
  COURSES: {
    GET_ALL: '/trainee/courses',
    START: (courseId) => `/trainee/courses/${courseId}/start`,
    GET_BY_ID: (courseId) => `/trainee/courses/${courseId}`,
    GET_MODULE: (courseId, moduleId) => `/trainee/courses/${courseId}/modules/${moduleId}`,
  },
  TESTS: {
    SUBMIT: (moduleId) => `/tests/${moduleId}/submit`,
    GET_RESULTS: (testId) => `/tests/${testId}/results`,
  }
};
