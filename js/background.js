chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url))
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['js/libs/turndown.js', "js/libs/purify.min.js"],
    })
      .catch(err => console.log(err));
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['bundled/main.js']
  });
});