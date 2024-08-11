// Import the necessary Shoelace components
import './shoelace-styles';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import {sleep} from "../shared/utils/jsShorteners";
import appInfos from "../../infos.json";

async function pages() {
  // Select the container where the Shoelace components will be added
  const container = document.querySelector('.container');

  switch (container.id) {
    case 'options-container':
      //Create title
      const title = document.createElement('h1');
      title.textContent = `${appInfos.APP_NAME} Options`;
      title.style.textAlign = 'center';
      title.style.marginBottom = '1rem';
      container.appendChild(title);

      // Create a form
      const form = document.createElement('form');
      form.style.display = 'flex';
      form.style.flexDirection = 'column';
      form.style.justifyContent = 'center';
      form.style.alignItems = 'center';
      container.appendChild(form);

      const options = document.createElement('div');
      options.id = 'options-fieldset';
      options.style.padding = '0 0 1rem 0';
      options.style.width = '100%';
      // options.style.textAlign = 'center';
      // options.style.display = 'flex';
      // options.style.justifyContent = 'space-between';
      form.appendChild(options);

      const storedFormat = await chrome.storage.sync.get(['filenameFormat']);

      // Create an input for the filename format
      const input = document.createElement('sl-input');
      input.placeholder = 'Enter filename format';
      input.label = 'Filename format';
      input.value = storedFormat.filenameFormat;
      options.appendChild(input);

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
        alert.style.transition = 'all 0.5s';
        alert.style.margin = '1rem 0';
        // alert.appendChild(alertIcon);
        container.appendChild(alert);
        alert.open = true;
        await sleep(5000);
        alert.remove();
      });
      break;
    case "popup-icon-container":
      // Create a title
      const titlePopup = document.createElement('h1');
      titlePopup.textContent = `Select a filter to use to export the page content`;
      titlePopup.style.textAlign = 'center';
      titlePopup.style.marginBottom = '1rem';
      container.appendChild(titlePopup);

      const subtitlePopup = document.createElement('p');
      subtitlePopup.textContent = `Help: Filters are made by other people, downloaded from the internet to your computer when you click on "Download" and used to extract information from the page, when you click "Export" and, next, each time you click on the extension icon when you are on this website. You can also create your own filters if no one is available for the website you want to export. See how.`;
      subtitlePopup.style.textAlign = 'center';
      subtitlePopup.style.marginBottom = '1rem';
      container.appendChild(subtitlePopup);

      //list elt: button: Install and export

      // Create a button to open the options page
      const openOptionsButton = document.createElement('sl-button');
      openOptionsButton.textContent = 'Options';
      openOptionsButton.setAttribute('variant', 'primary');
      openOptionsButton.style.width = '100%';
      openOptionsButton.style.marginBottom = '1rem';
      container.appendChild(openOptionsButton);

      // Handle button click
      openOptionsButton.addEventListener('click', async () => {
        await chrome.action.setPopup({popup: "pages/options.html"});
      });

      // Create a button to close the popup
      const closeButton = document.createElement('sl-button');
      closeButton.textContent = 'Close';
      closeButton.setAttribute('variant', 'primary');
      closeButton.style.width = '100%';
      closeButton.style.marginBottom = '1rem';
      container.appendChild(closeButton);

      // Handle button click
      closeButton.addEventListener('click', async () => {
        window.close();
      });
      break;
    default:
      console.error('No valid container found')
      break;
  }
}

pages();