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
