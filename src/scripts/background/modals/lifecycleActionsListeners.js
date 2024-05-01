import {defineDisplayModalOnInstall} from "./defineDisplayModalOnInstall";

export function setInstalledAction() {
  chrome.runtime.onInstalled.addListener(
    (details) => defineDisplayModalOnInstall(details)
  );
}

export function setUninstalledAction() {
  chrome.runtime.setUninstallURL(
    'https://save.hugocollin.com/uninstalled',
    () => console.log('Uninstall survey URL set')
  );
}

export function setLifecycleActions() {
  setInstalledAction();
  setUninstalledAction();
}
