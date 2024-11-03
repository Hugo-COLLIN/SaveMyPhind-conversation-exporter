import {appendModalContainer} from "./actions/appendModalContainer";
import {displayInstallModals} from "./actions/displayInstallModals";

export async function launchModalIntegration(domain: {name: string, url: string}) {
  await appendModalContainer();
  await displayInstallModals(domain);
}
