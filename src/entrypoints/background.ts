import {initModalsLogic} from "../features/modals/bg/manageModals";
import {setRedirects} from "../features/browser/setRedirects";
import {setDefaultOptionsAtInstall} from "../features/options/defaultOptions";
import {initBrowserInterface} from "../features/browser/interface";

background();

function background() {
  console.log("Background script running")
  initBrowserInterface();
  initModalsLogic();
  setRedirects();
  setDefaultOptionsAtInstall();
  // batchScraping();
}
