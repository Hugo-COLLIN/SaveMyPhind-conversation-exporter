// Import the necessary Shoelace components
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';

// Select the container where the Shoelace components will be added
const container = document.getElementById('options-container');

// Create a new Shoelace button element
const button = document.createElement('sl-button');
button.textContent = 'Click Me'; // Set the text inside the button
button.setAttribute('variant', 'primary'); // Set the variant attribute for styling

// Append the button to the container
container.appendChild(button);

// Optionally, add an event listener to the button
button.addEventListener('click', () => {
  alert('Button was clicked!');
});
