chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Action loaded.");
  if (changeInfo.status === 'complete' && /^http/.test(tab.url))
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['turndown.js']
    })
      .then(() => {
        console.log("Local Library ok.");
      })
      .catch(err => console.log(err));
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("Action clicked.");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js']
  });
});