import {launchModalIntegration} from "../tasks/launchModalIntegration.tab";

export async function pageIntegrationListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}
