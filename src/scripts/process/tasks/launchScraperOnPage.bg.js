import {launchScrapping} from "./scrapping.tab";
import {clickOnListElt} from "../../units/page/interact-DOM/interact.tab";

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
