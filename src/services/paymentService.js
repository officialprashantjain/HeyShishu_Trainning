import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants/endpoints';

export const paymentService = {
  /**
   * Initiates the payment by creating an order securely on the backend.
   * @param {number} amount Amount in paise (optional)
   */
  initiatePayment: async (amount = 99900) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT.INITIATE, { amount });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate payment.');
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
