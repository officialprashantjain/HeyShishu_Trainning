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
    REQUEST_REVIEW: '/trainee/request-review',
    // Additional trainee specific endpoints...
  },
  PAYMENT: {
    CREATE_ORDER: '/payment/create-order',
    VERIFY: '/payment/verify',
  },
  COURSES: {
    GET_ALL: '/trainee/courses',
    UPDATE_PROGRESS: (courseId) => `/trainee/courses/${courseId}/progress`,
    START: (courseId) => `/trainee/courses/${courseId}/start`,
    GET_BY_ID: (courseId) => `/trainee/courses/${courseId}`,
    GET_MODULE: (courseId, moduleId) => `/trainee/courses/${courseId}/modules/${moduleId}`,
    GET_PROGRESS: (courseId) => `/trainee/course-progress/${courseId}`,
    SYNC_PROGRESS: '/trainee/course-progress/sync',
  },
  TESTS: {
    SUBMIT_MODULE: (moduleId) => `/trainee/modules/${moduleId}/test/submit`,
    SUBMIT: (moduleId) => `/tests/${moduleId}/submit`,
    GET_RESULTS: (testId) => `/tests/${testId}/results`,
  }
};
