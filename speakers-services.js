class SpeakerService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getSpeakers() {
    try {
      const response = await this.apiClient.request(API_ENDPOINTS.SPEAKERS());
      return response?.data || [];
    } catch (error) {
      console.error('Failed to fetch speakers:', error);
      throw error;
    }
  }
}

window.SpeakerService = SpeakerService;