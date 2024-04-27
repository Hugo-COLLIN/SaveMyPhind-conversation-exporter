export function setInstalledAction() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
      chrome.storage.sync.set({displayModalWelcome: true}, function () {
        console.log("Welcome modal will be displayed");
      });
    } else if (details.reason === "update") {
      chrome.storage.sync.set({displayModalUpdate: true}, function () {
        console.log("Last update modal will be displayed");
      });
    }
  });
}

export function setUninstalledAction() {
  chrome.runtime.setUninstallURL('https://save.hugocollin.com/uninstalled', function () {
    // This callback function will run when the URL is set.
    console.log('Uninstall survey URL set');
  });
}

