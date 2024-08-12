import appInfos from "../../../infos.json";

export function defineStoreLink() {
  const manifest = chrome.runtime.getManifest();
  if (manifest.browser_specific_settings !== undefined && manifest.browser_specific_settings.gecko !== undefined) {
    return {url: appInfos.URLS.STORES.FIREFOX + "/reviews", name: "Firefox Add-ons Store"};
  } else {
    return {url: appInfos.URLS.STORES.CHROME + "/reviews", name: "Chrome Web Store"};
  }
}
