import {listenIconClick} from "./icon/iconAction";
import {buildContextMenu} from "./contextMenu/buildContextMenu";
import {listenTabsToUpdateIcon} from "./icon/defineIcon";
import {initClickCount} from "./icon/clickCount";
import {initModalOnInstall} from "./alert/manageModals";
import {setUninstalledRedirect} from "./alert/setUninstalledRedirect";
// import {launchScrappingActionOnPage} from "../../content/launch/launchScraperOnPage";
// import {defineProcessingState} from "../scraper/defineProcessingState";

background();

function background() {
  buildContextMenu();
  listenIconClick();
  listenTabsToUpdateIcon();
  initClickCount();
  initModalOnInstall();
  setUninstalledRedirect();

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({filenameFormat: '%t'});
  });

  // exportAllThreadsListener();
  // scrapOnLoadListener();
}

