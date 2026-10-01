import axiosInstance from '../lib/axios';

const meetingService = {
  /**
   * Fetch all meetings assigned to the logged-in trainee
   */
  getMyMeetings: async (params = {}) => {
    return axiosInstance.get('/trainee/meetings', { params });
  },

  /**
   * Fetch details of a specific meeting
   */
  getMeetingDetail: async (meetingId) => {
    return axiosInstance.get(`/trainee/meetings/${meetingId}`);
  },

  /**
   * Get Agora RTC Token for joining a meeting
   */
  getAgoraToken: async (meetingId) => {
    const res = await axiosInstance.post(`/meetings/${meetingId}/token`);
    return res.data;
  },
};

export default meetingService;
