import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js';

registerIconLibrary('base', {
  resolver: name => `${chrome.runtime.getURL('files/icons/shoelace')}/${name}.svg`,
  mutator: svg => svg.setAttribute('fill', 'currentColor')
});

const loadComponents = async () => {
  const { ExportOptions } = await import('../features/options/ExportOptions');
}

loadComponents();






// /**
//  * Router to load the correct component based on the current page.
//  */
// const loadComponent = async () => {
//   const currentPageUrl = window.location.pathname;
//
//   let pageContent;
//
//   switch (currentPageUrl) {
//     case '/options.html':
//       pageContent = await import('../interfaces/ExportOptions');
//       customElements.define('smc-component', pageContent.ExportOptions);
//       break;
//     default:
//       console.error('Page not found:', currentPageUrl);
//       pageContent = await import('../interfaces/ExportOptions');
//       break;
//
//   }
//
// };
//
// loadComponent();
