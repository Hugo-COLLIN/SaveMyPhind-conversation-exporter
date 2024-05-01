import {defineProcessingState} from "./defineProcessingState";
import {launchScrappingActionOnPage} from "../../content/launch/launchScraperOnPage";

export function exportAllThreadsListener() {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return defineProcessingState(request, sendResponse);
  });
}

export function scrapOnLoadListener(domain) {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    return launchScrappingActionOnPage(request, domain, sendResponse);
  });
}
