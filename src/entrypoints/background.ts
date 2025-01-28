import {initModalsLogic} from "../features/modals/bg/manageModals";
import {setRedirects} from "../features/browser/setRedirects";
import {setDefaultTemplateFilenameAtInstall} from "../features/scraper/output/templateFilenameListener";
import {initBrowserInterface} from "../features/browser/interface";

background();

function background() {
  console.log("Background script running")
  initBrowserInterface();
  initModalsLogic();
  setRedirects();
  setDefaultTemplateFilenameAtInstall();
  // listenExportRequest();
  // batchScraping();
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

