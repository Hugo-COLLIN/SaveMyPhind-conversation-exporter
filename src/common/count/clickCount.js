export function clickCountInit() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install" || details.reason === "update") {
      chrome.storage.sync.set({"clickIconCount": 49});
    }
  });
}

export function updateClickIconCount() {
  chrome.storage.sync.get("clickIconCount", function (result) {
    chrome.storage.sync.set({"clickIconCount": result.clickIconCount - 1});
  });
}

export function resetClickCount(count) {
  chrome.storage.sync.set({"clickIconCount": count}); //100
}
