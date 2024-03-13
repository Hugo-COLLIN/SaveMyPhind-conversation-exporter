import {actionExtensionIconClicked, actionPageLoaded} from "./scripts/process/tab/triggers";
// import infos from "./infos";

tab();

async function tab() {
  // console.log(infos.APP_MODE)
  chrome.storage.local.get(['isInjecting'], async function (result) {
    result.isInjecting ? await actionExtensionIconClicked() : await actionPageLoaded();
    await chrome.storage.local.set({isInjecting: false});
  });
}
