import {handleModalDisplay} from "../views/components/modals/cs/actions/displayCtaModals";
import {setLoadListener} from "../utils/cs/window/setLoadListener";
import {detectPageLoad} from "../services/checker/detectPageLoad";
import {launchScrapping} from "../services/export/scraper/scrapPage";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../services/checker/allowedDomains.json"
import {domainChecker} from "../services/checker/domainChecker";
import {getHostAndPath} from "../utils/cs/getters";
import {getStorageData} from "../data/chromeStorage";
import {safeExecute} from "../utils/jsShorteners";
import {SCRAPER_FALLBACK_ACTION} from "../utils/cs/fallbackActions";

/**
 * @description - Main function to handle action on the tab
 */
async function tab() {
  const isInjecting = await getStorageData('isInjecting', 'local')
    .catch(() => false);

  isInjecting
    ? await actionExtensionIconClicked()
    : await actionPageLoaded();

  await chrome.storage.local.set({isInjecting: false});
}

/**
 * @description - Action to execute when the page is loaded
 */
export async function actionPageLoaded() {
  const domain = domainChecker(LOAD_DOMAINS, getHostAndPath());
  if (domain === null) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  await setLoadListener(domain);
}

/**
 * @description - Action to execute when the extension icon is clicked
 */
export async function actionExtensionIconClicked() {
  // console.info("Icon clicked")
  const domainPage = domainChecker(EXPORT_DOMAINS, getHostAndPath());
  if (domainPage === null) {
    console.warn("Domain not allowed");
    return;
  }

  await safeExecute(async () => {
    await launchScrapping(domainPage);
    handleModalDisplay();
  }, SCRAPER_FALLBACK_ACTION());
}

// Launch the main content script
tab();
