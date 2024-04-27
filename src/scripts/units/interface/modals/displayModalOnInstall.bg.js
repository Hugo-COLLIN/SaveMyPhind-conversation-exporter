export function displayModalOnInstall(details) {
  if (details.reason === "install") {
    chrome.storage.sync.set({displayModalWelcome: true}, function () {
      console.log("Welcome modal will be displayed");
    });
  } else if (details.reason === "update") {
    chrome.storage.sync.set({displayModalUpdate: true}, function () {
      console.log("Last update modal will be displayed");
    });
  }
}
