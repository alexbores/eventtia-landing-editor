unlayer.registerTool({
  name: 'speakers',
  label: 'Speakers',
  icon: 'fa-smile',
  supportedDisplayModes: ['web'],
  options: {
    speakers: {
      // Property Group
      title: 'Speakers', // Title for Property Group
      position: 1, // Position of Property Group
      options: {
        speakersNumber: {
          label: 'Number', 
          defaultValue: '1',
          widget: 'counter',
        },
        speakerNameFilter: {
          label: 'Filter By Name', 
          defaultValue: '',
          widget: 'text',
        },
      },
    },
  },
  values: {
    data: {
      speakers: [
        {
          attributes: {
            picture: { large: "https://via.placeholder.com/300" },
            full_name: "John Doe",
            position: "CEO"
          }
        },
        {
          attributes: {
            picture: { large: "https://via.placeholder.com/300" },
            full_name: "Jane Smith",
            position: "CTO"
          }
        }
      ]
    }
  },
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        let html = ``;
        // Get the speakers array (or an empty array)
        const speakers = (values.data && values.data.speakers) || [];
        
        // Get the number of speakers to display and the name filter
        const speakersNumber = values.speakersNumber;
        const speakerNameFilter = values.speakerNameFilter 
          ? values.speakerNameFilter.toLowerCase().trim() 
          : "";
        
        // Filter speakers if a name filter is provided
        let filteredSpeakers = speakers;
        if (speakerNameFilter) {
          filteredSpeakers = speakers.filter(speaker => {
            const attrs = speaker.attributes || {};
            const fullName = (attrs.full_name || "").toLowerCase();
            const name = (attrs.name || "").toLowerCase();
            const lastName = (attrs.last_name || "").toLowerCase();
            
            return fullName.includes(speakerNameFilter) ||
                   name.includes(speakerNameFilter) ||
                   lastName.includes(speakerNameFilter);
          });
        }
        
        // Limit the number of speakers if speakersNumber is provided (>0)
        if (speakersNumber && speakersNumber > 0) {
          filteredSpeakers = filteredSpeakers.slice(0, speakersNumber);
        }
        
        // Build the HTML for each speaker
        filteredSpeakers.forEach(speaker => {
          html += `
            <div class="speaker-card">
              <img src="${speaker.attributes.picture.large}" alt="${speaker.attributes.full_name}" style="display: block; width: 100%; height: auto;">
              <h3 class="name">${speaker.attributes.full_name}</h3>
              <h4 class="position">${speaker.attributes.position}</h4>
            </div>
          `;
        });
        
        return `<div id="speakers-holder">${html}</div>`;
      },
    }),
    exporters: {
      web(values) {
        let html = ``;
        // Get the speakers array (or an empty array)
        const speakers = (values.data && values.data.speakers) || [];
        
        // Get the number of speakers to display and the name filter
        const speakersNumber = values.speakersNumber;
        const speakerNameFilter = values.speakerNameFilter 
          ? values.speakerNameFilter.toLowerCase().trim() 
          : "";
        
        // Filter speakers if a name filter is provided
        let filteredSpeakers = speakers;
        if (speakerNameFilter) {
          filteredSpeakers = speakers.filter(speaker => {
            const attrs = speaker.attributes || {};
            const fullName = (attrs.full_name || "").toLowerCase();
            const name = (attrs.name || "").toLowerCase();
            const lastName = (attrs.last_name || "").toLowerCase();
            
            return fullName.includes(speakerNameFilter) ||
                   name.includes(speakerNameFilter) ||
                   lastName.includes(speakerNameFilter);
          });
        }
        
        // Limit the number of speakers if speakersNumber is provided (>0)
        if (speakersNumber && speakersNumber > 0) {
          filteredSpeakers = filteredSpeakers.slice(0, speakersNumber);
        }
        
        // Build the HTML for each speaker
        filteredSpeakers.forEach(speaker => {
          html += `
            <div class="speaker-card">
              <img src="${speaker.attributes.picture.large}" alt="${speaker.attributes.full_name}" style="display: block; width: 100%; height: auto;">
              <h3 class="name">${speaker.attributes.full_name}</h3>
              <h4 class="position">${speaker.attributes.position}</h4>
            </div>
          `;
        });
        
        return `<div id="speakers-holder">${html}</div>`;
      },
    },
    head: {
      css: function (values) {
        return `
          #speakers-holder {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          #speakers-holder .speaker-card {
            flex: calc(33.33% - 20px);
            border-radius: 20px;
            background-color: white;
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            padding-bottom: 20px;
          }
          #speakers-holder .speaker-card img {
            display: block;
            width: 100%;
            height: auto;
            margin-bottom: 20px;
          }
          #speakers-holder .speaker-card .name,
          #speakers-holder .speaker-card .position{
            margin-right: 10px;
            margin-left: 10px;
          }
        `;
      },
      js: function (values) {
        console.log("Speakers tool values:", values);
      },
    },
  },
});



