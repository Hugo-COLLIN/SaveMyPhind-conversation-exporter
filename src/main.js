import {actionExtensionIconClicked, actionPageLoaded} from "./scripts/process/tab/triggers";
// import infos from "./infos";

main();

async function main() {
  // console.log(infos.APP_MODE)
  chrome.storage.local.get(['isInjecting'], async function (result) {
    result.isInjecting ? await actionExtensionIconClicked() : await actionPageLoaded();
    await chrome.storage.local.set({isInjecting: false});
  });
}
