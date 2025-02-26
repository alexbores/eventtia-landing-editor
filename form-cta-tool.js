unlayer.registerTool({
  name: 'form_cta_tool',
  label: 'Form CTA',
  icon: 'fa-star',
  supportedDisplayModes: ['web'],
  options: {},
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {

        return `
          <div class="registration-form-cta" >
            <button open-form-modal class="button">Register</button>
          </div>
        `;
      },
    }),
    exporters: {
      web: function (values) {
        return `
          <div class="registration-form-cta" >
            <button open-form-modal class="button">Register</button>
          </div>
        `;
      },
    },
    head: {
      css: function (values) {
        return `
           .registration-form-cta{
             position: relative;
           }
           .registration-form-cta .button{
                all: unset;
                min-height: 30px;
                border-radius: 1000px;
                background-color: black;
                max-width: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                padding: 5px 20px;
                min-width: 100px;
                font-size: 18px;
                cursor: pointer;
                box-sizing: content-box;
           }
        `
      },
      js: function (values) {

        


      },
    },
  },
});


