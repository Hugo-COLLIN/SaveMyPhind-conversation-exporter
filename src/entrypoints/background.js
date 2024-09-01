import {listenIconClick} from "../scripts/background/interface/icon/iconAction";
import {buildContextMenu} from "../scripts/background/interface/contextMenu/buildContextMenu";
import {listenTabsToUpdateIcon} from "../scripts/background/interface/icon/defineIcon";
import {initClickCount} from "../scripts/background/interface/icon/clickCount";
import {initModalOnInstall} from "../scripts/background/interface/alert/manageModals";
import {setUninstalledRedirect} from "../scripts/background/interface/alert/setUninstalledRedirect";
import appInfos from "../data/infos.json";

// import {launchScrappingActionOnPage} from "../../content/launch/launchScraperOnPage";
// import {defineProcessingState} from "../scraper/defineProcessingState";

background();

function background() {
  console.log("Background script running")
  buildContextMenu();
  listenIconClick();
  listenTabsToUpdateIcon();
  initClickCount();
  initModalOnInstall();
  setUninstalledRedirect();

  chrome.runtime.onInstalled.addListener(async (details) => {
    const displayModalWelcome = await chrome.storage.sync.get('displayModalWelcome');

    // Create "welcome" modal if needed
    if (displayModalWelcome['displayModalWelcome']) {
      await chrome.tabs.create({url: appInfos.URLS.TUTORIALS, active: true});
      await chrome.storage.sync.set({displayModalWelcome: false});
    }
  });

  chrome.runtime.onInstalled.addListener(async (details) => {
    const filenameTemplate = await chrome.storage.sync.get("filenameTemplate");
    if (!filenameTemplate["filenameTemplate"]) {
      chrome.storage.sync.set({filenameTemplate: '%Y-%M-%D_%h-%m-%s_%W_%T'});
    }
  });

  // exportAllThreadsListener();
  // scrapOnLoadListener();
}

