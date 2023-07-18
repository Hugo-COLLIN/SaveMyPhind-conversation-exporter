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
  // Enables the icon to be set when the tab is reloaded
  chrome.tabs.get(tabId, function(tab) {
    setIcon({url: tab.url}, tabId);
  });
});

chrome.runtime.onInstalled.addListener(async function () {
  const tabsWindow = await chrome.tabs.query({currentWindow: false});
  for (const tab of tabsWindow) {
    setIcon({url: tab.url}, tab.id)
  }
}
);

function setIcon(changeInfo, tabId) {
  if (changeInfo.url) {
    if (changeInfo.url.includes("phind.com")) {
      chrome.action.setIcon({ path: { "48": "img/icons/icon_phind-48.png"}, tabId: tabId });
    } else if (changeInfo.url.startsWith('http://') || changeInfo.url.startsWith('https://')) {
      chrome.action.setIcon({ path: { "48": "img/icons/icon_web-48.png"}, tabId: tabId });
    } else {
      chrome.action.setIcon({ path: { "48": "img/icons/icon_disabled-48.png"}, tabId: tabId });
    }
  }
}