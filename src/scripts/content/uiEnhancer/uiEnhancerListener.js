import {launchModalIntegration} from './modals/actions/displayInstallModals.js';

export async function pageIntegrationListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}
