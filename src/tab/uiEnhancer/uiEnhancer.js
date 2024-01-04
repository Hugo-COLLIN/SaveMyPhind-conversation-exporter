import {appendModalContainer} from "./modals/appendModalContainer";
import ModalUpdate from "./modals/ModalUpdate";


export async function uiEnhancer(domain) {
  window.addEventListener('load', async function () {
    // Create modal container
    await appendModalContainer();

    const modalUpdate = new ModalUpdate(domain);

    // Create "last update" modal if needed
    chrome.storage.sync.get(['displayModalUpdate'], async function (result) {
      if (result.displayModalUpdate)
        await modalUpdate.appendModal()
    });
  });
}
