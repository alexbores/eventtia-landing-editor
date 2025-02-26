unlayer.registerTool({
  name: 'form_modal',
  label: 'Form Modal',
  icon: 'fa-star',
  usageLimit: 1,
  supportedDisplayModes: ['web'],
  options: {},
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return `
          <div id="registrationForm">
            <h3>Form Modal Block</h3>
          </div>
        `;
      },
    }),
    exporters: {
      web: function (values) {
        

        let options = '';
        (values.data && values.data.attendeeTypes || []).forEach(type => {
          options += `
            <option value="${type?.id}">${type?.attributes.name}</option>
          `;
        });

        return `
          <div id="form-modal" modal-open="false">
           <div class="form-wrapper">
             <div class="icon" close-modal>
                <p aria-label="close">X</p>
             </div>
             <form class="registration-form" id="registrationForm">
            <div class="form-group">
              <label for="attendeeTypeId">Attendee Type*</label>
              <select id="attendeeTypeId" name="attendeeTypeId" required>
                <option value="">Select an attendee type</option>
                ${options}
              </select>
            </div>
            
            <div class="form-group">
              <label for="firstName">First Name*</label>
              <input type="text" id="firstName" name="firstName" required>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name*</label>
              <input type="text" id="lastName" name="lastName" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email*</label>
              <input type="email" id="email" name="email" required>
            </div>

            <button type="submit" class="button button-1">
              <span>Register Now</span>
            </button>
             </form>
           </div>
          </div>

          <script>
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
        throw new Error(errorText);
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
          'Authorization': \`Bearer \${token}\`,
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
        throw new Error(errorText);
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


            async function registerAttendee(attendeeData) {
              try {
                let apiClient = new ApiClient();
                const response = await apiClient.request(
                  '${values.data?.registerAttendeeApi}', 
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

            window.addEventListener('load',()=>{
              

              let modal = document.querySelector('#form-modal');
              let buttons = document.querySelectorAll('[open-form-modal]');
              let form = document.getElementById('registrationForm');

              buttons.forEach(btn=>{
                btn.addEventListener('click',()=>{
                  modal.setAttribute('modal-open',true);
                });
              });

              let close = document.querySelector('[close-modal]');
              close?.addEventListener('click',()=>{
                  modal.setAttribute('modal-open',false);
              });

              form.addEventListener('submit', (e)=>{
                e.preventDefault();
                let formData = {
                  attendeeTypeId: form.attendeeTypeId.value,
                  firstName: form.firstName.value,
                  lastName: form.lastName.value,
                  email: form.email.value,
                  company: 'test',
                  telephone: '',
                };
                console.log(formData);
                registerAttendee(formData).then(()=>{
                   modal.setAttribute('modal-open',false);
                });
              });
              
              
            });
          </script>
        `;
      },
    },
    head: {
      css: function (values) {
        return `
          /* Modal container, hidden by default */
#form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none; /* Hidden by default */
  align-items: center;
  justify-content: center;
  z-index: 1000;
}


/* Show modal when modal-open is true */
#form-modal[modal-open="true"] {
  display: flex;
}

#form-modal .icon{
  margin-bottom: 30px;
  margin-left: auto;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* Overlay shadow covering the entire screen */
#form-modal::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 14%);
  z-index: -1;
}

/* Centered form wrapper */
#form-modal .form-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
}
#form-modal .form-wrapper .registration-form{
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
}       


#form-modal .registration-form .form-group {
  flex: calc(50% - 20px);
}

#form-modal .registration-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

#form-modal .registration-form input,
#form-modal .registration-form select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#form-modal .registration-form button {
  background-color: #034078;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
}

#form-modal .registration-form button:hover {
  background-color: #002f50;
}

        `
      },
      js: function (values) {
         console.log("modal tool values:", values);
        


      },
    },
  },
});


