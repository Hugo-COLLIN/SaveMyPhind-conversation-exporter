import {detectPageLoad, domainExportChecker, domainLoadChecker} from "../../units/processing/checker/domainChecker.all";
import {launchExport} from "./exportProcess";
import {uiEnhancer} from "./uiEnhancer";
// import ModalDetectClicks from "./uiEnhancer/modals/ModalDetectClicks";
import {checkClickCountAndDisplayModal} from "../../units/interface/modals/clickCount.all";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  launchExport(domainPage);
  checkClickCountAndDisplayModal(domainPage);
}

export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null ) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  uiEnhancer(domain);
}
