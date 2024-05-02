import ModalUpdate from "../types/ModalUpdate";
import ModalMessage from "../types/ModalMessage";
import {getStorageData} from "../../../../shared/utils/chromeStorage";

export async function displayInstallModals(domain) {
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

