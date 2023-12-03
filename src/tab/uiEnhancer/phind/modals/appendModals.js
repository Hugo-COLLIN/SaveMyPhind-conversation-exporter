import {createModal, createModalBg, modalUpdateContent} from "./createModal";
import {waitAppend} from "../../interactDOM/interactDOM";

export async function appendModalUpdate() {
  // Create modal
  let modalbg = createModalBg()
  // let modalUpdateLogs = await createModalUpdate(modalbg, modalUpdateContent);
  let modalUpdateLogs = await createModal(modalbg, modalUpdateContent);

  // console.log("Passed HERE")
  // Append modal
  waitAppend("body", [modalbg, modalUpdateLogs], 'appendChild');

  // Update storage
  chrome.storage.sync.set({displayModalUpdate: false}, function () {
    console.log("Last update modal will not be displayed until the next update");
  });
}