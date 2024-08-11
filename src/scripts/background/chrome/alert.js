export function setPopup(info) {
  if (info.menuItemId === "openOptions") {
    chrome.windows.create({
      url: chrome.runtime.getURL("pages/options.html"),
      type: "popup",
      width: 400,
      height: 600
    });
  }
  // else if (info.menuItemId === "openIconPopup") {
  //   chrome.action.setPopup({popup: "pages/popup.html"}, () => {
  //     chrome.action.openPopup().then(r =>
  //       chrome.action.setPopup({popup: ""})
  //     );
  //   });
  // }
}

export function initModalOnInstall() {
  chrome.runtime.onInstalled.addListener(
    (details) => {
      defineDisplayModalOnInstall(details);
      chrome.storage.sync.set({filenameFormat: '%t'});
    }
  );
}

export function defineDisplayModalOnInstall(details) {
  switch (details.reason) {
    case "install":
      chrome.storage.sync.set({displayModalWelcome: true},
        () => console.log("Welcome modal will be displayed")
      );
      break;
    case "update":
      chrome.storage.sync.set({displayModalUpdate: true},
        () => console.log("Last update modal will be displayed")
      );
      break;
  }
}

export function setUninstalledRedirect() {
  chrome.runtime.setUninstallURL(
    'https://save.hugocollin.com/uninstalled',
    () => console.log('Uninstall survey URL set')
  );
}
