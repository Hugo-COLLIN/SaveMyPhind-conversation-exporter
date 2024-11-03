import {launchModalIntegration} from "../../../views/components/modals/cs/launchModalIntegration";
import {safeExecute} from "../../jsShorteners";

export async function setLoadListener(domain: {name: string, url: string}) {
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
