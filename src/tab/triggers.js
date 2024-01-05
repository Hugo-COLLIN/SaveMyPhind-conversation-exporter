import {detectPageLoad, domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport} from "./exportProcessor/exportProcess";
import {uiEnhancer} from "./uiEnhancer/uiEnhancer";
// import ModalDetectClicks from "./uiEnhancer/modals/ModalDetectClicks";
import {checkClickCountAndDisplayModal} from "./uiEnhancer/modals/clickCount";

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
