import {domainChecker} from "../../../core/services/domainChecker/domainChecker";
import {EXPORT_DOMAINS} from "../../../data/allowedDomains.json";
import {defineOutputMethod} from "../output/defineOutputMethod";
import {safeExecute} from "../../../core/utils/jsShorteners";
import {updateClickIconCount} from "../../browser/icon/clickCount";

export async function launchScraper(tab: chrome.tabs.Tab) {
  if (!tab || tab.url?.startsWith("chrome://")) {
    console.warn(`Tab ${tab?.id || ''} is not injectable`);
    return;
  }

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

    await chrome.scripting.executeScript({
      target: {tabId: tab.id || 0},
      files: ['tab.js']
    });

  } catch (error) {
    console.error("Error executing script: ", error);
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'EXPORT_CONTENT') {
    const {domain, extracted} = message.payload;
    await safeExecute(
      defineOutputMethod(domain, extracted),
      EXPORTER_FALLBACK_ACTION()
    );
    console.log("Export done!");

    // Increment click icon count
    await updateClickIconCount();
  }
});

export function EXPORTER_FALLBACK_ACTION() {
  return (error: { stack: string; }) => {
    throw new Error("File conversion error:\n" + error.stack);
  };
}
