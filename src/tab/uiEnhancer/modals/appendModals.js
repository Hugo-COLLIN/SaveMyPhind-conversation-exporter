import {createModal, modalClicksContent, modalUpdateContent} from "./createModal";
import appInfos from "../../../infos.json";
import {resetClickCount} from "../../../common/count/clickCount";


async function appendModal(modalContentCreator, ...params) {

  // Create modal
  let {modal, modalBackground} = await createModal(modalContentCreator, ...params);

  const shadow = document.querySelector("#" + appInfos.APP_SNAME + "-modal-container").shadowRoot
  shadow.appendChild(modalBackground);
  shadow.appendChild(modal);
}

export async function appendModalUpdate(domain) {
  await appendModal(modalUpdateContent, domain);

  // Update storage
  chrome.storage.sync.set({displayModalUpdate: false}, function () {
    console.log("Last update modal will not be displayed until the next update");
  });
}

export function appendModalDetectClicks() {
  chrome.storage.sync.get('clickIconCount', async function (result) {
    if (result.clickIconCount <= 0) {
      await appendModal(modalClicksContent);

      // Update storage
      resetClickCount(99);
    }
  });
}

export async function appendModalContainer() {
  const host = document.createElement('div');
  host.id = appInfos.APP_SNAME + "-modal-container";
  document.body.appendChild(host);

  // Attach a Shadow DOM to the host element
  const shadow = host.attachShadow({mode: 'open'});

  // Create a style element to reset all inheritable properties
  const style = document.createElement('style');
  style.textContent = ':host { all: initial; } p{line-height: 1.7em;} a{font-size: 1.1em;}';
  shadow.appendChild(style);

  // Add styles to the shadow dom
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('assets/styles/phind.bundle.css')
  shadow.appendChild(link);

  host.setAttribute("extension", appInfos.APP_SNAME);

}
