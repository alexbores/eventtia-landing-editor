// Constants for API configuration
var API_CONFIG = {
  EVENT_ID: '45206',
  INCLUDES: ['activities', 'activities.workshop_categories']
};

// API endpoints
var API_ENDPOINTS = {
  SPEAKERS: function() {
    return '/events/' + API_CONFIG.EVENT_ID + '/speakers?include=' + API_CONFIG.INCLUDES.join(',');
  },
  EVENT_DETAILS: function() {
    return '/events/' + API_CONFIG.EVENT_ID;
  },
  ATTENDEE_TYPES: function() {
    return '/events/' + API_CONFIG.EVENT_ID + '/attendee_types';
  },
  REGISTER_ATTENDEE: function() {
    return '/events/' + API_CONFIG.EVENT_ID + '/attendees/register';
  }
};