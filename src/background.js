/*
--- This is the code for the extension to run when the icon is clicked ---
 */
chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js']
  });
});


/*
--- This is the code for the extension icon to change depending on the website ---
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  setIconForCurrentTab(tabId);
});

chrome.runtime.onInstalled.addListener(async function () {
  setIconForCurrentTab((await chrome.tabs.query({ active: true, currentWindow: true }))[0].id);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  setIconForCurrentTab(activeInfo.tabId);
});


/**
 * Enables the icon to be set when the tab is reloaded
 * @param tabId the id of the tab that is reloaded
 */
function setIconForCurrentTab(tabId)
{
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
  if (url.includes("phind.com")) {
    chrome.action.setIcon({ path: { "48": "img/icons/icon_phind-48.png"}, tabId: tabId });
  }
}