import {actionExtensionIconClicked, actionPageLoaded} from "./activeTab/triggers";
// import infos from "./infos";

main();

async function main() {
  // console.log(infos.APP_MODE)
  window.isInjecting ? await actionExtensionIconClicked() : await actionPageLoaded();
}