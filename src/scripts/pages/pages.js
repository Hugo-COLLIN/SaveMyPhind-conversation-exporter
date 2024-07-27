// Import the necessary Shoelace components
import './shoelace-styles';
import '@shoelace-style/shoelace/dist/components/button/button.js';

// Select the container where the Shoelace components will be added
const container = document.querySelector('.container');

switch (container.id) {
  case 'options-container':
    // Create a new Shoelace button element
    const button = document.createElement('sl-button');
    button.textContent = 'Click Me'; // Set the text inside the button
    button.setAttribute('variant', 'secondary'); // Set the variant attribute for styling

    // Append the button to the container
    container.appendChild(button);

    // Optionally, add an event listener to the button
    button.addEventListener('click', () => {
      alert('Button was clicked!');
    });
    break;
  default:
    console.error('No valid container found')
    break;
}
