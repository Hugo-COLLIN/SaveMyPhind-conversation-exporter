import { domainChecker } from "../../../core/services/domainChecker/domainChecker";
import { EXPORT_DOMAINS } from "../../../data/allowedDomains.json";

export async function launchScraper(tab: chrome.tabs.Tab) {
  if (!tab || tab.url?.startsWith("chrome://")) {
    console.warn(`Tab ${tab?.id || ''} is not injectable`);
    return;
  }

  // const domainPage = domainChecker(EXPORT_DOMAINS, tab?.url?.split("https://")[1]);
  const domainPage = domainChecker(EXPORT_DOMAINS, tab?.url?.split("https://")[1] as string);
  if (domainPage === null) {
    console.warn("Domain not allowed: ", tab.url);
    return;
  }

  try {
    console.info("Injecting script")
    await chrome.storage.local.set({
      isInjecting: true,
      domainPage: domainPage
    });
    // console.log(chrome.storage.local.get(['isInjecting']));

    await chrome.scripting.executeScript({
      target: {tabId: tab.id || 0},
      files: ['tab.js']
    });

  } catch (error) {
    console.error("Error executing script: ", error);
  }
}
