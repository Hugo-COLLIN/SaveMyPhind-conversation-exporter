// Import the necessary Shoelace components
import './shoelace-styles';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

async function pages() {
  // Select the container where the Shoelace components will be added
  const container = document.querySelector('.container');

  switch (container.id) {
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
