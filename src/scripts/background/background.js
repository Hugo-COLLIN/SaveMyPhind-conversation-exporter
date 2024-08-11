import {listenIconClick} from "./interface/icon/iconAction";
import {buildContextMenu} from "./interface/contextMenu/buildContextMenu";
import {listenTabsToUpdateIcon} from "./interface/icon/defineIcon";
import {initClickCount} from "./interface/icon/clickCount";
import {initModalOnInstall} from "./interface/alert/manageModals";
import {setUninstalledRedirect} from "./interface/alert/setUninstalledRedirect";
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

