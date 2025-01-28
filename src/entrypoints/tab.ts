import {scrapPage} from "../features/scraper/scrapPage";
import {getStorageData} from "../core/utils/chromeStorage";
import {loadedInjection} from "../features/modals/cs/loadedInjection";

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
  await loadedInjection();
}

/**
 * @description - Action to execute when the extension icon is clicked
 */
export async function actionExtensionIconClicked() {
  await scrapPage();
}

// Launch the main content script
tab();
