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
function setIcon(url, tabId) {
  if (url) {
    if (url.includes("phind.com")) {
      chrome.action.setIcon({path: {"48": "assets/icons/icon_phind-48.png"}, tabId: tabId});
    }
    else if (url.includes("perplexity.ai")) {
      chrome.action.setIcon({path: {"48": "assets/icons/icon_perplexity-48.png"}, tabId: tabId});
    }
  }
}