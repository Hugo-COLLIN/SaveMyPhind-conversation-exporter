import {launchModalIntegration} from "../tasks/modals/displayInstallModals.tab";

export async function pageIntegrationListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}
