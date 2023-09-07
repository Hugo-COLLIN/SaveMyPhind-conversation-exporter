import {actionExtensionIconClicked, actionPageLoaded} from "./activeTab/triggers";

main();

async function main() {
  window.isInjecting ? await actionExtensionIconClicked() : await actionPageLoaded();
}