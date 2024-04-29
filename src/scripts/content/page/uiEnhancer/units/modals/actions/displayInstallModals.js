import {appendModalContainer} from "../appendModalContainer";
import ModalUpdate from "../units/ModalUpdate";
import ModalMessage from "../units/ModalMessage";
import {getStorageData} from "../../../../../../shared/utils/chromeStorage";

export async function launchModalIntegration(domain) {
  // Create modal container
  await appendModalContainer();

  const displayModalUpdate = await getStorageData('displayModalUpdate', 'sync');
  const displayModalWelcome = await getStorageData('displayModalWelcome', 'sync');

  // Create "last update" modal if needed
  if (displayModalUpdate) {
    await new ModalUpdate(domain).appendModal()
    chrome.storage.sync.set({displayModalUpdate: false});
  }

  // Create "welcome" modal if needed
  if (displayModalWelcome) {
    await new ModalMessage('assets/modalMessages/modalTutorial.md').appendModal();
    chrome.storage.sync.set({displayModalWelcome: false});
  }
}
