import {displayModalOnInstall} from "../../units/interface/modals/displayModalOnInstall.bg";

export function setInstalledAction() {
  chrome.runtime.onInstalled.addListener(function (details) {
    displayModalOnInstall(details);
  });
}

export function setUninstalledAction() {
  chrome.runtime.setUninstallURL('https://save.hugocollin.com/uninstalled', function () {
    // This callback function will run when the URL is set.
    console.log('Uninstall survey URL set');
  });
}

