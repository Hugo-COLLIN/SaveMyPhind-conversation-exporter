chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url))
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['turndown.js', "showdown.js", "purify.min.js", "markdown-it.js", "html2markdown.js", "reMarked.js"],
    })
      .catch(err => console.log(err));
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js']
  });
});