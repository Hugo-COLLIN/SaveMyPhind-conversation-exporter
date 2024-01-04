//TODO: object Clicker with array of numbers : each time click on icon, use the next number before displaying popup

export function clickCountInit() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install" || details.reason === "update") {
      chrome.storage.sync.set({"clickIconCount": 20});
    }
  });
}

export function updateClickIconCount() {
  chrome.storage.sync.get("clickIconCount", function (result) {
    chrome.storage.sync.set({"clickIconCount": result.clickIconCount - 1});
  });
}

export function resetClickCount(count = 50) {
  chrome.storage.sync.set({"clickIconCount": count}); //100
}
