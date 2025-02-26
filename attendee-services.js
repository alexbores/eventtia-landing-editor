class AttendeeService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getAttendeeTypes() {
    try {
      const response = await this.apiClient.request(API_ENDPOINTS.ATTENDEE_TYPES());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch attendee types:', error);
      throw error;
    }
  }

  async registerAttendee(attendeeData) {
    try {
      const response = await this.apiClient.request(
        API_ENDPOINTS.REGISTER_ATTENDEE(), 
        {
          method: 'POST',
          body: JSON.stringify({
            attendee: {
              attendee_type_id: attendeeData.attendeeTypeId,
              first_name: attendeeData.firstName,
              last_name: attendeeData.lastName,
              email: attendeeData.email,
              company: attendeeData.company,
              telephone: attendeeData.telephone,
              job_title: attendeeData.jobTitle
            }
          })
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to register attendee:', error);
      throw error;
    }
  }
}

window.AttendeeService = AttendeeService;