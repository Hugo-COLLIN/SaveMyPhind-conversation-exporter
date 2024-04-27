// import infos from "./infos";
import {checkClickCountAndDisplayModal} from "../units/interface/modals/clickCount.all";
import {uiEnhancer} from "./events/uiEnhancer.tab";
import {detectPageLoad} from "./events/detectPageLoad.tab";
import {launchScrapping} from "./scraper/launchScrapping.tab";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../../data/allowedDomains.json";
import {domainChecker} from "../units/processing/checker/domainChecker.all";

async function tab() {
  // console.log(infos.APP_MODE)
  chrome.storage.local.get(['isInjecting'], async function (result) {
    result.isInjecting ? await actionExtensionIconClicked() : await actionPageLoaded();
    await chrome.storage.local.set({isInjecting: false});
  });
}

export async function actionPageLoaded() {
  const domain = await domainChecker(LOAD_DOMAINS);
  if (domain === null) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  uiEnhancer(domain);
}

export async function actionExtensionIconClicked() {
  const domainPage = await domainChecker(EXPORT_DOMAINS);
  if (domainPage === null) return;
  launchScrapping(domainPage);
  checkClickCountAndDisplayModal(domainPage);
}

tab();
