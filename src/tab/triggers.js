import {detectPageLoad, domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport} from "./exportProcessor/exportProcess";
import {uiEnhancer} from "./uiEnhancer/uiEnhancer";
import ModalDetectClicks from "./uiEnhancer/modals/ModalDetectClicks";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  launchExport(domainPage);
  new ModalDetectClicks(domainPage).appendModal();
}

export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null) return;
  detectPageLoad(domain);
  // scrapOnLoadListener();
  uiEnhancer(domain);
}
