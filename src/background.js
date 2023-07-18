chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js']
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  setIcon(changeInfo, tabId);
});

chrome.runtime.onInstalled.addListener(async function () {
  const tabsWindow = await chrome.tabs.query({currentWindow: false});
  console.log(tabsWindow)
  for (const tab of tabsWindow) {
    console.log(tab)
    console.log(tab.url)
    setIcon({url: tab.url}, tab.id)
  }
}
);

function setIcon(changeInfo, tabId) {
  if (changeInfo.url) {
    if (changeInfo.url.includes("phind.com")) {
      chrome.action.setIcon({ path: { "32": "img/download_icons/icon_phind-32.png"}, tabId: tabId });
      console.log("passed1")
    } else {
      chrome.action.setIcon({ path: { "32": "img/download_icons/icon_web-32.png"}, tabId: tabId });
      console.log("passed2")
    }
  }
}