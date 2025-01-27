export function templateFilenameListener() {
  chrome.runtime.onInstalled.addListener(async (details) => {
    const filenameTemplate = await chrome.storage.sync.get("filenameTemplate");
    if (!filenameTemplate["filenameTemplate"]) {
      chrome.storage.sync.set({filenameTemplate: '%Y-%M-%D_%h-%m-%s_%W_%T'});
    }
  });
}
