export function notify() {
  onInstalledNotifier();
  onUninstalledNotifier();
}

function onInstalledNotifier() {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install")
    {
      // TODO: first install modal
      // chrome.storage.sync.set({displayModalUpdate: true}, function () {
      //   console.log("Last update modal will be displayed");
      // });
    }
    else if(details.reason === "update")
    {
      chrome.storage.sync.set({displayModalUpdate: true}, function () {
        console.log("Last update modal will be displayed");
      });
    }
  });
}

function onUninstalledNotifier() {
  chrome.runtime.setUninstallURL('https://save.hugocollin.com/uninstalled', function () {
    // This callback function will run when the URL is set.
    console.log('Uninstall survey URL set');
  });
}