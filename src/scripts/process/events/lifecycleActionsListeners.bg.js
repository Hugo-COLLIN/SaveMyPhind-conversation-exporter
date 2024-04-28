import {displayModalOnInstall} from "../../units/interface/modals/displayModalOnInstall.bg";

export function setInstalledAction() {
  chrome.runtime.onInstalled.addListener(
    (details) => displayModalOnInstall(details)
  );
}

export function setUninstalledAction() {
  chrome.runtime.setUninstallURL(
    'https://save.hugocollin.com/uninstalled',
    () => console.log('Uninstall survey URL set')
  );
}

