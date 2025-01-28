import {handleModalDisplay} from "../core/components/modals/cs/actions/displayCtaModals";
import {detectPageLoad} from "../features/scraper/domainCheck/detectPageLoad";
import {launchScrapping} from "../features/scraper/scrapPage";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../features/scraper/domainCheck/allowedDomains.json"
import {domainChecker} from "../core/services/domainChecker/domainChecker";
import {getHostAndPath} from "../core/utils/cs/getters";
import {getStorageData} from "../core/utils/chromeStorage";
import {safeExecute} from "../core/utils/jsShorteners";
import {SCRAPER_FALLBACK_ACTION} from "../features/fallbackActions";
import {setLoadListener} from "../features/modals/cs/launchModalIntegration";

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
