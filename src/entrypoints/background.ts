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
  // batchScraping();
}
