import {domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport, scrapOnLoadListener} from "./scraper/scraper";
import {improveUI} from "./uiEnhancer/uiEnhancer";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  launchExport(domainPage);
}

export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null) return;
  scrapOnLoadListener();
  // improveUI();
}