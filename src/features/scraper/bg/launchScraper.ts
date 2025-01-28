import { domainChecker } from "../../../core/services/domainChecker/domainChecker";
import { EXPORT_DOMAINS } from "../../../data/allowedDomains.json";
import { defineOutputMethod } from "../output/defineOutputMethod";
import { safeExecute } from "../../../core/utils/jsShorteners";
import appInfos from "../../../data/infos.json";

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

// Écouter les messages du content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXPORT_CONTENT') {
    const { domain, extracted } = message.payload;
    handleExport(domain, extracted);
  }
});

async function handleExport(domain: { name: string; url: any; }, extracted: any) {
  await safeExecute(defineOutputMethod(domain, extracted), EXPORTER_FALLBACK_ACTION());
  console.log("Export done in background!");
}

export function EXPORTER_FALLBACK_ACTION() {
  return (error: { stack: string; }) => {
    // @ts-ignore TODO variables at compile time
    console.error(`${appInfos.APP_SNAME}: File conversion error.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    throw new Error("File conversion error:\n" + error.stack);
  };
}
