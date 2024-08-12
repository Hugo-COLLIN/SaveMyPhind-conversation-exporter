// TODO: currently used by content-script, should be in the background-script
import {launchScrapping} from "../scraper/scrapPage";
import {clickOnListElt} from "../../interact/interact";

export function launchScrappingActionOnPage(request, domain, sendResponse) {
  if (request.message === 'executeScript') {
    if (request.index > 0) launchScrapping(domain);
    clickOnListElt(request.index)
    setTimeout(function () {
      sendResponse({message: 'scriptExecuted'});
    }, 1);
  }
  return true; // will respond asynchronously
}
