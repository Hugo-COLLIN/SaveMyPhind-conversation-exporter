import {detectPageLoad, domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport} from "./scraper/scraper";
import {improveUI} from "./uiEnhancer/uiEnhancer";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  launchExport(domainPage);
}

// Not working due to Phind new UI
export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null) return;
  detectPageLoad(domain);
  // scrapOnLoadListener();
  improveUI();
}