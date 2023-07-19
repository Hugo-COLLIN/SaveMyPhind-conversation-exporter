import {setIconForCurrentTab} from "./setIcon";

/**
 * This is the code for the extension icon to change depending on the website
 */
export function iconListeners() {

  // Enables the icon to be set when the tab is reloaded
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    setIconForCurrentTab(tabId);
  });

// chrome.runtime.onInstalled.addListener(async function () {
//   setIconForCurrentTab((await chrome.tabs.query({ active: true, currentWindow: true }))[0].id);
// });

  chrome.tabs.onActivated.addListener((activeInfo) => {
    setIconForCurrentTab(activeInfo.tabId);
  });
}