import {createModalBg, createModal, modalClicksContent} from "../uiEnhancer/phind/modals/createModal";
import {waitAppend} from "../uiEnhancer/interactDOM/interactDOM";

export function detectClicksModal() {
  chrome.storage.sync.get('clickIconCount', async function (result) {
    if (result.clickIconCount >= 99) { //100
      // Create modal
      let modalUpdateLogs = await createModal(modalClicksContent);

      // Append modal
      waitAppend("body", [modalUpdateLogs], 'appendChild');

      // Update storage
      chrome.storage.sync.set({"clickIconCount": 0}, function () {
        // reset clickIconCount
      });
    }
  });
}