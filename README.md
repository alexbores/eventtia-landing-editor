# Template Editor

This project is a landing page template editor built using [Unlayer](https://unlayer.com/). It allows users to create, edit, and publish event landing pages with a locked layout—enabling editing only for texts and images—and includes custom tools such as speakers and form modules.

## Features

- **Unlayer Editor Integration:**  
  Embeds the Unlayer editor for a drag‑and‑drop editing experience with custom tools.

- **Custom Tools:**  
  - **Speakers Tool:** Displays speaker cards (with images, full names, and positions) using data loaded from an API.
  - **Form Modal Tool:** Contains a registration form that saves or publishes landing pages and triggers downloads.

- **Template Selector:**  
  Dynamically loads saved landing page templates from a server folder (`/landing`) and populates a dropdown with available JSON file names.

- **Saving & Publishing:**  
  Exports the Unlayer design as HTML and JSON, and sends it via AJAX to a PHP endpoint (`create-landing.php`) to be stored on the server.

- **Downloading JSON:**  
  Provides a function to download the current design’s JSON with a timestamped filename (prefixed with "landing-").


## Installation and Setup

- Needs to be run in localhost with php support.

- add credentials in form-tools.js at line 86 and in api-client.js at line 23.
