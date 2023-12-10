import {createModal, modalClicksContent, modalUpdateContent} from "./createModal";
import {getAppInfos} from "../../../../common/appInfos";

async function appendModal(modalContentCreator) {
  const appInfos = await getAppInfos();

  // Create modal
  let {modal, modalBackground} = await createModal(modalContentCreator);

  const shadow = document.querySelector("#" + appInfos.APP_SNAME + "-modal-container").shadowRoot
  shadow.appendChild(modalBackground);
  shadow.appendChild(modal);
}

export async function appendModalUpdate() {
  await appendModal(modalUpdateContent);

  // Update storage
  chrome.storage.sync.set({displayModalUpdate: false}, function () {
    console.log("Last update modal will not be displayed until the next update");
  });
}

export function appendDetectClicksModal() {
  chrome.storage.sync.get('clickIconCount', async function (result) {
    if (result.clickIconCount >= 99) { //100
      await appendModal(modalClicksContent);

      // Update storage
      chrome.storage.sync.set({"clickIconCount": 0}, function () {
        // reset clickIconCount
      });
    }
  });
}

export async function appendModalContainer() {
  const appInfos = await getAppInfos();

  const host = document.createElement('div');
  host.id = appInfos.APP_SNAME + "-modal-container";
  document.body.appendChild(host);

  // Attach a Shadow DOM to the host element
  const shadow = host.attachShadow({mode: 'open'});

  // Add styles to the shadow dom
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('assets/styles/phind.bundle.css')
  shadow.appendChild(link);

  host.setAttribute("extension", appInfos.APP_SNAME);

}