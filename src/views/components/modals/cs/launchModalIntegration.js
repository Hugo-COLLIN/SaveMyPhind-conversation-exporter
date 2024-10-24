import {appendModalContainer} from "./actions/appendModalContainer";
import {displayInstallModals} from "./actions/displayInstallModals";

export async function launchModalIntegration(domain) {
  await appendModalContainer();
  await displayInstallModals(domain);
}
