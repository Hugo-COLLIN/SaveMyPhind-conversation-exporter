// Import the necessary Shoelace components
import './shoelace-styles';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import {sleep} from "../shared/utils/jsShorteners";

async function pages() {
  // Select the container where the Shoelace components will be added
  const container = document.querySelector('.container');

  switch (container.id) {
    case 'options-container':
      // Create a form
      const form = document.createElement('form');
      container.appendChild(form);

      const storedFormat = await chrome.storage.sync.get(['filenameFormat']);

      // Create an input for the filename format
      const input = document.createElement('sl-input');
      input.placeholder = 'Enter filename format';
      input.label = 'Filename format';
      input.value = storedFormat.filenameFormat;
      form.appendChild(input);

      // Create a submit button
      const button = document.createElement('sl-button');
      button.textContent = 'Save';
      button.setAttribute('variant', 'primary');
      button.submit = true;
      form.appendChild(button);





      // Handle form submission
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const format = input.value;
        await chrome.storage.sync.set({filenameFormat: format});

        // // Create a success alert
        // const alertIcon = document.createElement('sl-icon');
        // alertIcon.name = 'check2-circle';
        // alertIcon.slot = 'icon';
        const alert = document.createElement('sl-alert');
        alert.variant = 'success';
        alert.textContent = 'Options saved successfully';
        // alert.appendChild(alertIcon);
        container.appendChild(alert);
        alert.open = true;
        await sleep(5000);
        alert.remove();
      });
      break;
    default:
      console.error('No valid container found')
      break;
  }
}

pages();
