import {launchModalIntegration} from "../uiEnhancer/modals/launchModalIntegration";
import {safeExecute} from "../../shared/utils/jsShorteners";

export async function setLoadListener(domain) {
  window.addEventListener('load', async function () {
    await safeExecute(launchModalIntegration(domain));
  });
}

export function setMaxAILoadListener() {
  window.addEventListener('load', async function () {
    const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
    await chrome.storage.local.set({isMaxAI: isMaxAI});
    return isMaxAI;
  })
}
