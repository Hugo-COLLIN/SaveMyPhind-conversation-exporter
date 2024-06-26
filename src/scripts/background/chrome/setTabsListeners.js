import {focusDependingSetIcon, defineIcon} from "../icon/iconImage/defineIcon";

/**
 * This is the code for the extension icon to change depending on the website
 */
export function setTabsListeners() {
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
