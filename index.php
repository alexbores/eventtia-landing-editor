<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Luxury Event Template Editor</title>
  <!-- Load Unlayer's embed script -->
  <script src="https://editor.unlayer.com/embed.js"></script>
  <script src="./constants.js"></script>
  <script src="./api-client.js"></script>
  <script src="./speakers-services.js"></script>
  <script src="./attendee-services.js"></script>

</head>
<body>

  <div class="tools-content">

    <!-- Template Selector UI -->
    <div id="template-selector">
      <label for="templateSelect">Select Template: </label>
      <select id="templateSelect">
      </select>
    </div>


    <button save>Save and Publish Page</button>
    <div class="modal" modal-open id="published-page">
        
        <div class="wrapper">
            <div class="icon" close-modal>
               <p aria-label="close">X</p>
            </div>
            <a href="" target="_blank">View Published page</a>
        </div>
        
    </div>


    <button download>Download JSON</button>
  
  </div>

  <!-- Unlayer Editor Container -->
  <div id="editor-container"></div>

  <script>
    function initUnlayer(){
      unlayer.init({
        id: 'editor-container',
        projectId: 266987,
        project: {
          name: 'Luxury Event Template',
          description: 'A landing page template for luxury events with a locked layout and only text/image editing.'
        },
        displayMode: 'web', 
        designMode: 'edit',
        customJS: [ 
           //limited to 1 because of the current plan, 
           //links must be by domain because are run in an iframe
          'http://localhost/speakers-tool.js',
          'http://localhost/form-cta-tool.js',
          'http://localhost/form-tool.js',
        ],
        tools: {
          text: { enabled: true },
          image: { enabled: true },
          'custom#speakers': {
             data: {
               speakers: speakers
             },
          },
          'custom#form_modal': {
            data: {
               attendeeTypes: attendeeTypes,
               registerAttendeeApi: registerAttendeeApi,
            },
          },
        },
        options: {
          features: {
            blocks: {
              draggable: false,
              addBlocks: false,
              removeBlocks: false,
              duplicateBlocks: false
            }
          }
        },
        customCSS:[
          `
           .design-web .container{
             max-width: 1000px;
           }
          `
        ],
      });
    }

    


    function downloadJSON() {
      new Promise((resolve, reject) => {
        unlayer.exportHtml((data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error("Export JSON failed."));
          }
        });
      })
      .then(result => {
        console.log("Export result json:", result.design);
        downloadJSONfile(result.design);
      })
      .catch(err => {
        console.error("Error exporting JSON:", err);
      });
    }
    function downloadJSONfile(jsonObject) {
      // Convert the JSON object to a string with indentation
      const jsonStr = JSON.stringify(jsonObject, null, 2);
    
      // Generate a timestamped filename with the "landing-" prefix
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const filename = `landing-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.json`;
    
      // Create a Blob with the JSON data and the proper MIME type
      const blob = new Blob([jsonStr], { type: 'application/json' });
      // Create an object URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
    
      // Append the link to the document, trigger a click, and then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);
    }
    function save() {
      new Promise((resolve, reject) => {
        unlayer.exportHtml((data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error("Export HTML failed."));
          }
        });
      })
      .then(result => {
        console.log("Export result html:", result.html);
        createLandingPage(result.html,result.design);
      })
      .catch(err => {
        console.error("Error exporting HTML:", err);
      });
    }
    function createLandingPage(htmlContent, jsonContent) {
      fetch('./create-landing.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          htmlContent: htmlContent,
          jsonContent: jsonContent
        })
      })
        .then(response => response.json())
        .then(data => {
          if(data.success){
            console.log('File created successfully:', data.filePath);
            let modal = document.querySelector('#published-page');
            let pageLink = document.querySelector('#published-page a');
            modal.setAttribute('modal-open', 'true');
            pageLink.setAttribute('href', data.filePath);
          } else {
            console.error('Error creating file:', data.error);
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }




    function fetchTemplateFilenames() {
      return fetch('./get-saved-template-names.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(fileNames => {
        console.log("Fetched file names:", fileNames);
        return fileNames;
      })
      .catch(err => {
        console.error("Error fetching file names:", err);
        return [];
      });
    }
    function populateTemplateSelect() {
      fetchTemplateFilenames().then(fileNames => {
        const selectElement = document.getElementById('templateSelect');
        if (fileNames && Array.isArray(fileNames)) {
          fileNames.forEach(fileName => {
            const option = document.createElement('option');
            option.value = fileName;
            option.textContent = fileName;
            selectElement.appendChild(option);
          });
        }
      });
    }
    function setTemplate(fileName){
      const url = '/landing/' + fileName;
      
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch template JSON');
        }
        return response.json();
      })
      .then(templateData => {
        unlayer.loadDesign(templateData);
      })
      .catch(err => {
        console.error('Error loading template:', err);
      });
    }


    
    // dom events
    function initEvents(){
       let saveButton = document.querySelector('[save]');
       saveButton.addEventListener('click',()=>{
          save();
       });

       let downloadButton = document.querySelector('[download]');
       downloadButton.addEventListener('click',()=>{
          downloadJSON();
       });

       let modal = document.querySelector('#published-page');
       let closeButton = document.querySelector('[close-modal]');
       closeButton.addEventListener('click',()=>{
           modal.setAttribute('modal-open',false);
       });


       // Listen for changes in the template selector.
       const templateSelect = document.getElementById('templateSelect');
       templateSelect.addEventListener('change', (e)=>{
         setTemplate(e.target.value);
       });
    };



   
    document.addEventListener('DOMContentLoaded', ()=>{
      initAllUnlayer();

      initEvents();
    });

    
    let speakers;
    let speakerService;
    let attendeeTypes;
    let registerAttendeeApi;
    function initAllUnlayer(){
       try {
        // Initialize API client
        let apiClient = new ApiClient();
    
        // Initialize services
        speakerService = new SpeakerService(apiClient);

        async function getSpeakers() {
          try {
            speakers = await speakerService.getSpeakers();
            console.log("Speakers:", speakers);
          } catch (error) {
            throw new Error(error);
          }
        }


        let attendeeService = new AttendeeService(apiClient);

        async function getAttendeeTypes(){
          try {
            attendeeTypes = await attendeeService.getAttendeeTypes();
            console.log("attendees:", attendeeTypes);
          } catch (error) {
            throw new Error(error);
          }
        }

        registerAttendeeApi = API_ENDPOINTS.REGISTER_ATTENDEE();

        Promise.all([
          getSpeakers(), getAttendeeTypes(), populateTemplateSelect()
        ]).then(() => {
          console.log('init Unlayer');
          initUnlayer();
          let selectElement = document.getElementById('templateSelect');
          if (selectElement && selectElement.options.length > 0) {
            let firstOptionValue = selectElement.options[0].value;
            setTemplate(firstOptionValue);
          }
        })
        .catch((err) => {
          console.error('Error in async calls:', err);
        });

        
        
        

        console.log('🚀 Application initialized successfully');

      } catch (error) {
        console.error('❌ Failed to initialize application:', error);
      }
    }

    




  </script>
</body>
</html>


<style type="text/css">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
*{
  font-family: Arial, sans-serif;
}
.tools-content{
  background-color: #f7f7f7;  
  display: flex;
  align-items: center;
  gap: 20px;
}
#template-selector {
  height: 60px;
  background-color: #f7f7f7;
  padding: 10px;
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
}
#editor-container {
  height: calc(100% - 60px);
}


/* Modal container, hidden by default */
.modal {
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
.modal[modal-open="true"] {
  display: flex;
}
.modal .icon{
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
.modal::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 14%);
  z-index: -1;
}
.modal .wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.modal .wrapper a{
    
} 


</style>
