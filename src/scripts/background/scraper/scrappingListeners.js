import {defineExportState} from "./defineScrappingState";
import {launchScrappingActionOnPage} from "../launch/launchScraperOnPage";

export function exportAllThreadsListener() {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return defineExportState(request, sendResponse);
  });
}

export function scrapOnLoadListener(domain) {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    return launchScrappingActionOnPage(request, domain, sendResponse);
  });
}
