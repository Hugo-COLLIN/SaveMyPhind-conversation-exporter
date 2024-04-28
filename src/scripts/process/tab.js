import {handleModalDisplay} from "./tasks/handleModalDisplay.tab";
import {pageIntegrationListener} from "./events/pageIntegrationListener.tab";
import {detectPageLoad} from "../units/processing/checker/detectPageLoad.tab";
import {launchScrapping} from "./tasks/scrapping.tab";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../../data/allowedDomains.json";
import {domainChecker} from "../units/processing/checker/domainChecker.all";
import {getHostAndPath} from "../units/utils/getters.tab";
import {getStorageData} from "../units/utils/chromeStorage.all";

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
  pageIntegrationListener(domain);
}

export async function actionExtensionIconClicked() {
  const domainPage = domainChecker(EXPORT_DOMAINS, getHostAndPath());
  if (domainPage === null) return;
  launchScrapping(domainPage);
  handleModalDisplay();
}

tab();
