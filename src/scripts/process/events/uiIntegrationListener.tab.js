import {launchModalIntegration} from "../tasks/launchModalIntegration.tab";

export async function uiIntegrationListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}
