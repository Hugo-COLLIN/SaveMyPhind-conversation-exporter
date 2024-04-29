import {launchScrapping} from "../../content/scraper/scrapPage";
import {clickOnListElt} from "../../content/page/interact-DOM/interact";

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
