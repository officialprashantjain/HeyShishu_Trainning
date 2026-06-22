export const APPLICATION_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_DONE: 'payment_done',
  TRAINING_IN_PROGRESS: 'training_in_progress',
  TRAINING_COMPLETED: 'training_completed',
  UNDER_REVIEW: 'under_review',
  REVIEW_DONE: 'review_done',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CREDENTIALS_SENT: 'credentials_sent',
}

export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  PAYMENT: '/payment',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/[courseId]',
  MODULE_CONTENT: '/courses/[courseId]/modules/[moduleId]',
  MODULE_TEST: '/courses/[courseId]/modules/[moduleId]/test',
  REVIEW: '/review',
}
