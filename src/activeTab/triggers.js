import {domainExportChecker, domainLoadChecker} from "./checker/domainChecker";
import {launchExport, scrapOnLoadListener} from "./scraper/scraper";
import {improveUI} from "./uiEnhancer/uiEnhancer";

export async function actionExtensionIconClicked() {
  const domainPage = await domainExportChecker();
  if (domainPage === null) return;
  launchExport(domainPage);
}

function detectPageLoad(domain) {
if (domain.name === "MaxAIGoogle") {
  window.addEventListener('load', function () {
    const isMaxAI = document.querySelector('[id^=MAXAI]') !== null;
    chrome.storage.local.set({isMaxAI: isMaxAI});
  })
}

}

// Not working due to Phind new UI
export async function actionPageLoaded() {
  const domain = await domainLoadChecker();
  if (domain === null) return;
  detectPageLoad(domain);
  // scrapOnLoadListener();
  improveUI();
}