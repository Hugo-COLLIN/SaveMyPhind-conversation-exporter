//TODO: refactor this file - dispatch the code to the right place

import {launchModalIntegration} from "../tasks/launchModalIntegration.tab";


export async function uiIntegrationListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}
