import {launchModalIntegration} from "../tasks/integrateModals.tab";

export async function pageIntegrationListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}
