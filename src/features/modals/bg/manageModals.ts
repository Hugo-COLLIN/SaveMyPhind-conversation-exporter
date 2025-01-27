export function initModalOnInstall() {
  chrome.runtime.onInstalled.addListener(
    (details) => {
      defineDisplayModalOnInstall(details);
    }
  );
}

export function defineDisplayModalOnInstall(details: chrome.runtime.InstalledDetails) {
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

