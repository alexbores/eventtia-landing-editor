// ApiClient.js
class ApiClient {
  constructor() {
    this.baseUrl = 'https://connect.eventtia.com/api/v3';
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    try {
      if (this.isTokenValid()) {
        console.log('🔑 Using existing token');
        return this.token;
      }

      console.log('🔑 Requesting new token...');
      const response = await fetch(this.baseUrl + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: '',
          password: ''
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      if (!data.auth_token) {
        throw new Error('Invalid token response');
      }

      this.token = data.auth_token;
      this.tokenExpiry = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000);
      console.log('✅ New token obtained');
      
      return this.token;
    } catch (error) {
      console.error('❌ Error obtaining token:', error);
      throw error;
    }
  }

  isTokenValid() {
    return this.token && this.tokenExpiry && new Date() < this.tokenExpiry;
  }

  async request(endpoint, options = {}) {
    try {
      const token = await this.getToken();
      const url = this.baseUrl + endpoint;
      
      console.log('📡 Making API request to:', url);
      
      const defaultOptions = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...(options.headers || {})
        }
      };

      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Request successful');
      return data;
    } catch (error) {
      console.error('❌ API request error:', error);
      throw error;
    }
  }
}

window.ApiClient = ApiClient;