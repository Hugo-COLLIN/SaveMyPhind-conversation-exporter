export function clickCountInit() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install" || details.reason === "update") {
      chrome.storage.sync.set({"clickIconCount": 0}, function () {
        // console.log("Click icon count set to 0");
      });
    }
  });
}