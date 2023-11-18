import {createModalBg, createModal, modalClicksContent} from "../uiEnhancer/phind/modals/createModal";
import {waitAppend} from "../uiEnhancer/interactDOM/insertElements";

export function detectClicksModal() {
  chrome.storage.sync.get('clickIconCount', async function (result) {
    if (result.clickIconCount >= 100) { //100
      // Create modal
      let modalbg = createModalBg()
      // let modalUpdateLogs = await createModalUpdate(modalbg, modalUpdateContent);
      let modalUpdateLogs = await createModal(modalbg, modalClicksContent);

      // Append modal
      waitAppend("body", [modalbg, modalUpdateLogs], 'appendChild');

      // Update storage
      chrome.storage.sync.set({"clickIconCount": 0}, function () {
        // reset clickIconCount
      });
    }
  });
}