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

  chrome.runtime.onInstalled.addListener(async (details) => {
    const filenameTemplate = await chrome.storage.sync.get("filenameTemplate");
    if (!filenameTemplate["filenameTemplate"]) {
      chrome.storage.sync.set({filenameTemplate: '%Y-%M-%D_%h-%m-%s_%W_%T'});
    }
  });

  // exportAllThreadsListener();
  // scrapOnLoadListener();
}

