import {domainChecker} from "../processing/checker/domainChecker.all";
import {LOAD_DOMAINS} from "../../../data/allowedDomains.json"

/**
 * Sets the icon depending on the window focus
 * @param windowId the id of the window that is focused
 */
export function focusDependingSetIcon(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;

  chrome.tabs.query(
    {active: true, windowId: windowId},
    (tabs) => {
      if (tabs[0]) setIconForCurrentTab(tabs[0].id);
    }
  );
}

/**
 * Enables the icon to be set when the tab is reloaded
 * @param tabId the id of the tab that is reloaded
 */
export function setIconForCurrentTab(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    setIcon(tab.url, tabId);
  });
}

/**
 * Sets the icon depending on the url of the tab
 * @param url the url of the tab
 * @param tabId the id of the tab
 */
async function setIcon(url, tabId) {
  if (!url) return;

  const { name } = domainChecker(LOAD_DOMAINS, url.split("https://")[1]); // http:// ??
  // console.log("check:", name)

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
