import {listenIconClick} from "./chrome/icon/iconAction";
import {buildContextMenu} from "./chrome/buildContextMenu";
import {listenTabsToUpdateIcon} from "./chrome/icon/defineIcon";
import {initClickCount} from "./chrome/icon/clickCount";
import {initModalOnInstall, setUninstalledRedirect} from "./chrome/alert";
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

  // exportAllThreadsListener();
  // scrapOnLoadListener();
}

