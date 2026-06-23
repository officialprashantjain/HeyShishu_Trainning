import toast from 'react-hot-toast';

/**
 * Centralized Toast utility.
 * Use this wrapper instead of calling `toast` directly so you can ensure
 * all popups in the application have a uniform style and duration.
 */
export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#ecfdf5', // Tailwind primary-50
        color: '#047857',      // Tailwind primary-700
        border: '1px solid #10b981', // primary-500
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#ecfdf5',
      },
    });
  },
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#fef2f2', // danger-50
        color: '#b91c1c',      // danger-700
        border: '1px solid #ef4444', // danger-500
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
      },
    });
  },
  loading: (message) => {
    return toast.loading(message, {
      style: {
        background: '#f8fafc',
        color: '#334155',
        border: '1px solid #cbd5e1',
      },
    });
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};
