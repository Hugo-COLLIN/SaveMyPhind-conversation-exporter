import {initClickIconCount} from "../icon/clickCount/clickIconCountContext";
import {defineDisplayModalOnInstall} from "../modals/defineDisplayModalOnInstall";
// import {launchScrappingActionOnPage} from "../../content/launch/launchScraperOnPage";
// import {defineProcessingState} from "../scraper/defineProcessingState";

export function setRuntimeListeners() {
  chrome.runtime.onInstalled.addListener(
    (details) => {
      initClickIconCount(details);
      defineDisplayModalOnInstall(details);
    }
  );

  chrome.runtime.setUninstallURL(
    'https://save.hugocollin.com/uninstalled',
    () => console.log('Uninstall survey URL set')
  );

  // exportAllThreadsListener:
  // Needs to be after setTabsListeners and setActionListeners to work properly
  // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //   return defineProcessingState(request, sendResponse);
  // });

  // scrapOnLoadListener:
  // chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  //   return launchScrappingActionOnPage(request, domain, sendResponse);
  // });
}
