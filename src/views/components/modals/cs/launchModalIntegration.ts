import {appendModalContainer} from "./actions/appendModalContainer";
import {displayInstallModals} from "./actions/displayInstallModals";
import {safeExecute} from "../../../../utils/jsShorteners";

export async function setLoadListener(domain: { name: string, url: string }) {
  window.addEventListener('load', async function () {
    await safeExecute(launchModalIntegration(domain));
  });
}

export async function launchModalIntegration(domain: {name: string, url: string}) {
  await appendModalContainer();
  await displayInstallModals(domain);
}
