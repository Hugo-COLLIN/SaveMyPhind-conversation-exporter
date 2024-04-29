import {handleModalDisplay} from "./page/uiEnhancer/units/modals/actions/displayCtaModals";
import {pageIntegrationListener} from "./page/uiEnhancer/events/uiEnhancerListener";
import {detectPageLoad} from "./detectPageLoad";
import {launchScrapping} from "./scraper/scrapPage";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../../data/allowedDomains.json";
import {domainChecker} from "../shared/checker/domainChecker";
import {getHostAndPath} from "./getters";
import {getStorageData} from "../shared/utils/chromeStorage";

async function tab() {
  const isInjecting = await getStorageData('isInjecting', 'local')
  isInjecting
    ? await actionExtensionIconClicked()
    : await actionPageLoaded();
  await chrome.storage.local.set({isInjecting: false});
}

export async function actionPageLoaded() {
  const domain = domainChecker(LOAD_DOMAINS, getHostAndPath());
  if (domain === null) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  await pageIntegrationListener(domain);
}

export async function actionExtensionIconClicked() {
  const domainPage = domainChecker(EXPORT_DOMAINS, getHostAndPath());
  if (domainPage === null) return;
  launchScrapping(domainPage);
  await handleModalDisplay();
}

tab();
