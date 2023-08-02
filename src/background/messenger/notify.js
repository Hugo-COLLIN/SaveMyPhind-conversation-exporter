export function notify() {
  installNotifier();
  uninstallNotifier();
}

function installNotifier() {
  chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({displayModalUpdate: true}, function () {
      console.log("Last update modal will be displayed");
    });
  });
}

function uninstallNotifier() {
  chrome.runtime.setUninstallURL('https://forms.gle/5stYhnaRkBR9GGBv5', function () {
    // This callback function will run when the URL is set.
    console.log('Uninstall survey URL set');
  });
}