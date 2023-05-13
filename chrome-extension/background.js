chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url))
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['turndown.js', "purify.min.js", "markdown-it.min.js", "html2markdown.js", "marked.min.js", "reMarked.js", "showdown.js"]
    })
      .catch(err => console.log(err));
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['main.js']
  });
});