import {setDisplayModalOnInstall} from "../storage/setDisplayModalOnInstall.bg";

export function setInstalledAction() {
  chrome.runtime.onInstalled.addListener(
    (details) => setDisplayModalOnInstall(details)
  );
}

export function setUninstalledAction() {
  chrome.runtime.setUninstallURL(
    'https://save.hugocollin.com/uninstalled',
    () => console.log('Uninstall survey URL set')
  );
}

