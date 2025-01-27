import {listenIconClick} from "../features/browserInterface/bg/icon/iconAction";
import {buildContextMenu} from "../features/browserInterface/bg/contextMenu/buildContextMenu";
import {listenTabsToUpdateIcon} from "../features/browserInterface/bg/icon/defineIcon";
import {initClickCount} from "../features/browserInterface/bg/icon/clickCount";
import {initModalOnInstall} from "../features/modals/bg/manageModals";
import {displayWelcomeTutorial, setUninstalledRedirect} from "../features/browserInterface/bg/setRedirects";
import {templateFilenameListener} from "../services/export/output/templateFilenameListener";

// import {launchScrappingActionOnPage} from "../../content/launch/launchScraperOnPage";
// import {defineProcessingState} from "../scraper/defineProcessingState";

background();

function background() {
  console.log("Background script running")
  buildContextMenu();
  listenIconClick();
  listenTabsToUpdateIcon();
  // listenExportRequest();
  initClickCount();
  initModalOnInstall();
  setUninstalledRedirect();
  displayWelcomeTutorial();
  templateFilenameListener();

  // exportAllThreadsListener();
  // scrapOnLoadListener();
}

// function listenExportRequest() {
//     //on message from content script
//     chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//       if (request.action === "export") {
//         console.log("Export request received")
//         await safeExecute(defineOutputMethod(request.domain, request.extracted), EXPORTER_FALLBACK_ACTION());
//         return true;
//       }
//     });
// }

