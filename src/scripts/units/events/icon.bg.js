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
    } else if (url.includes("perplexity.ai")) {
      chrome.action.setIcon({path: {"48": "assets/icons/icon_perplexity-48.png"}, tabId: tabId});
    } else if (url.includes("google.com/search")) {
      chrome.storage.local.get("isMaxAI", (result) => {
        console.log(result.isMaxAI);
        result.isMaxAI ? chrome.action.setIcon({
          path: {"48": "assets/icons/icon_googleMaxAI-48.png"},
          tabId: tabId
        }) : ""
      });
    }
  }
}

/**
 * This is the code for the extension icon to change depending on the website
 */
export function iconListeners() {
  // Enables the icon to be set when the tab is reloaded
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    setIconForCurrentTab(tabId);
  });

  // Enables the icon to be set when the tab is changed
  chrome.tabs.onActivated.addListener((activeInfo) => {
    setIconForCurrentTab(activeInfo.tabId);
  });

  // Enables the icon to be set for already opened tabs in windows
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      return;
    }
    chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
      if (tabs[0]) {
        setIconForCurrentTab(tabs[0].id);
      }
    });
  });
}
