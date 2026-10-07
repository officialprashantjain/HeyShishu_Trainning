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
    return res?.data?.data ?? res?.data ?? res;
  },

  /**
   * Start screen sharing (get dedicated screen token + UID)
   */
  startScreenShare: async (meetingId) => {
    const res = await axiosInstance.post(`/meetings/${meetingId}/screenshare/start`);
    return res?.data?.data ?? res?.data ?? res;
  },

  /**
   * Stop screen sharing
   */
  stopScreenShare: async (meetingId) => {
    const res = await axiosInstance.post(`/meetings/${meetingId}/screenshare/stop`);
    return res?.data?.data ?? res?.data ?? res;
  },

  /**
   * Get screen share status
   */
  getScreenShareStatus: async (meetingId) => {
    const res = await axiosInstance.get(`/meetings/${meetingId}/screenshare/status`);
    return res?.data?.data ?? res?.data ?? res;
  },
};

export default meetingService;
