import {domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport, scrapOnLoadListener} from "./scraper/scraper";
import {initAnalytics, sendAnalytics} from "./analytics/analytics";
import {improveUI} from "./uiEnhancer/uiEnhancer";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  // initAnalytics();
  launchExport(domainPage);
  // await sendAnalytics('export', {hostName: domainPage.name, url: domainPage.url});
}

export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null) return;
  // initAnalytics();
  scrapOnLoadListener();
  improveUI();
  // await sendAnalytics('pageview', {hostName: domain.name, url: domain.url});
}