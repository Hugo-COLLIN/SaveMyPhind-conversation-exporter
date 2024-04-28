import {checkClickCountAndDisplayModal} from "../units/interface/modals/clickCount.all";
import {uiIntegrationListener} from "./events/uiIntegrationListener.tab";
import {detectPageLoad} from "../units/processing/checker/detectPageLoad.tab";
import {launchScrapping} from "./tasks/launchScrapping.tab";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../../data/allowedDomains.json";
import {domainChecker} from "../units/processing/checker/domainChecker.all";
import {getHostAndPath} from "../units/utils/getters.tab";

async function tab() {
  // console.log(infos.APP_MODE)
  chrome.storage.local.get(['isInjecting'], async function (result) {
    result.isInjecting ? await actionExtensionIconClicked() : await actionPageLoaded();
    await chrome.storage.local.set({isInjecting: false});
  });
}

export async function actionPageLoaded() {
  const domain = domainChecker(LOAD_DOMAINS, getHostAndPath());
  if (domain === null) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  uiIntegrationListener(domain);
}

export async function actionExtensionIconClicked() {
  const domainPage = domainChecker(EXPORT_DOMAINS, getHostAndPath());
  if (domainPage === null) return;
  launchScrapping(domainPage);
  checkClickCountAndDisplayModal(domainPage);
}

tab();
