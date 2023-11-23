import {detectPageLoad, domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport} from "./scraper/scraper";
import {uiEnhancer} from "./uiEnhancer/uiEnhancer";
import {detectClicksModal} from "./utils/detectClicksModal";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  launchExport(domainPage);
  detectClicksModal();
}

export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null) return;
  detectPageLoad(domain);
  // scrapOnLoadListener();
  uiEnhancer(domain);
}