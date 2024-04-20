import {setIconForCurrentTab} from "../units/icon/icon.bg";

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
    chrome.tabs.query({active: true, windowId: windowId}, (tabs) => {
      if (tabs[0]) {
        setIconForCurrentTab(tabs[0].id);
      }
    });
  });
}
