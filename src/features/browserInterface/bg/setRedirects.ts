import appInfos from "../../../data/infos.json";

export function setUninstalledRedirect() {
  chrome.runtime.setUninstallURL(
    'https://save.hugocollin.com/uninstalled',
    () => console.log('Uninstall survey URL set')
  );
}

export function displayWelcomeTutorial() {
  chrome.runtime.onInstalled.addListener(async (details) => {
    const displayModalWelcome = await chrome.storage.sync.get('displayModalWelcome');

    // Create "welcome" modal if needed
    if (displayModalWelcome['displayModalWelcome']) {
      await chrome.tabs.create({url: appInfos.URLS.TUTORIALS, active: true});
      await chrome.storage.sync.set({displayModalWelcome: false});
    }
  });
}
