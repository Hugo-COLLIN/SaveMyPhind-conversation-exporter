export function setDefaultOptionsAtInstall() {
  chrome.runtime.onInstalled.addListener(async (details) => {
    const defaultSettings = await chrome.storage.sync.get([
      "filenameTemplate",
      "outputOptions",
    ]);

    await chrome.storage.sync.set({
      filenameTemplate: defaultSettings.filenameTemplate || '%Y-%M-%D_%h-%m-%s_%W_%T',
      outputOptions: defaultSettings.outputOptions || {localDownload: true, webhook: false}
    });
  });
}
