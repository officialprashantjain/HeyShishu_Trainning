import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/endpoints';

export const paymentService = {
  /**
   * Initiates the payment by creating an order securely on the backend.
   * @param {string} referenceId The Trainee ID
   */
  createOrder: async (referenceId) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, { 
        moduleType: 'nanny_training',
        referenceId 
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment order.');
    }
  },

  /**
   * Verifies the dummy Razorpay payment and unlocks training arrays
   */
  verifyPayment: async (verificationData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT.VERIFY, verificationData);
      return response;
    } catch (error) {
       throw new Error(error.response?.data?.message || 'Payment verification failed.');
    }
  }
};
