import {launchModalIntegration} from '../uiEnhancer/modals/actions/displayInstallModals.js';

export async function setLoadListener(domain) {
  window.addEventListener('load', async function () {
    await launchModalIntegration(domain);
  });
}

export function setMaxAILoadListener() {
  window.addEventListener('load', async function () {
    const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
    await chrome.storage.local.set({isMaxAI: isMaxAI});
    return isMaxAI;
  })
}
