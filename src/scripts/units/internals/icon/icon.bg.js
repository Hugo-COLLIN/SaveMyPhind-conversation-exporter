import {domainChecker} from "../../processing/checker/domainChecker.all";
import {LOAD_DOMAINS} from "../../../../data/allowedDomains.json"
import {getTabData} from "../../utils/chromeStorage.all";

/**
 * Sets the icon depending on the window focus
 * @param windowId the id of the window that is focused
 */
export function focusDependingSetIcon(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;

  chrome.tabs.query(
    {active: true, windowId: windowId},
    (tabs) => {
      if (tabs[0]) defineIcon(tabs[0].id);
    }
  );
}

/**
 * Sets the icon depending on the url of the tab
 * @param tabId the id of the tab
 */
export async function defineIcon(tabId) {
  const {url} = await getTabData(tabId);
  // defineIcon(tab.url, tabId);
  if (!url) return;

  const { name } = domainChecker(LOAD_DOMAINS, url.split("https://")[1]); // http:// ??
  // console.log("check:", name);

  switch (name.toLowerCase()) {
    case "phind":
      chrome.action.setIcon({path: {"48": "assets/icons/icon_phind-48.png"}, tabId: tabId});
      break;
    case "perplexity":
      chrome.action.setIcon({path: {"48": "assets/icons/icon_perplexity-48.png"}, tabId: tabId});
      break;
    case "maxaigoogle":
      chrome.storage.local.get("isMaxAI", (result) => {
        console.log(result.isMaxAI);
        result.isMaxAI
          ? chrome.action.setIcon({
            path: {"48": "assets/icons/icon_googleMaxAI-48.png"},
            tabId: tabId
          })
          : ""
      });
      break;
  }
}
