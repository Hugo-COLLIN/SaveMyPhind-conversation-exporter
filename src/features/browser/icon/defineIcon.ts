import {domainChecker} from "../../../core/services/domainChecker/domainChecker";
import {LOAD_DOMAINS} from "../../../data/allowedDomains.json"
import {getTabData} from "../../../core/utils/chromeStorage";

/**
 * This is the code for the extension icon to change depending on the website
 */
export function listenTabsToUpdateIcon() {
  // Enables the icon to be set when the tab is reloaded
  chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => defineIcon(tabId)
  );

  // Enables the icon to be set when the tab is changed
  chrome.tabs.onActivated.addListener(
    (activeInfo) => defineIcon(activeInfo.tabId)
  );

  // Enables the icon to be set for already opened tabs in windows
  chrome.windows.onFocusChanged.addListener((windowId) => {
    focusDependingSetIcon(windowId);
  });
}

/**
 * Sets the icon depending on the window focus
 * @param windowId the id of the window that is focused
 */
export function focusDependingSetIcon(windowId: number) {
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
export async function defineIcon(tabId: number | undefined) {
  // @ts-ignore TODO
  const {url} = await getTabData(tabId);
  // defineIcon(tab.url, tabId);
  if (!url) return;

  const domain = domainChecker(LOAD_DOMAINS, url.split("https://")[1]); // http:// ??

  switch (domain?.name.toLowerCase()) {
    case "phind":
      chrome.action.setIcon({path: {"48": "../files/icons/icon_phind-48.png"}, tabId: tabId});
      break;
    case "perplexity":
      chrome.action.setIcon({path: {"48": "../files/icons/icon_perplexity-48.png"}, tabId: tabId});
      break;
    case "maxaigoogle":
      chrome.storage.local.get("isMaxAI", (result) => {
        console.log(result.isMaxAI);
        result.isMaxAI
          ? chrome.action.setIcon({
            path: {"48": "../files/icons/icon_googleMaxAI-48.png"},
            tabId: tabId
          })
          : ""
      });
      break;
    default:
      if (url.startsWith("http://") || url.startsWith("https://"))
        await chrome.action.setIcon({path: {"48": "../files/icons/icon_web-48.png"}, tabId: tabId});
  }
}
