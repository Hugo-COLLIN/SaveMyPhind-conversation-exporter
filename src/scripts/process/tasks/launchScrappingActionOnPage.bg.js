import {launchScrapping} from "./launchScrapping.tab";
import {clickOnListElt} from "../../units/interface/interact-DOM/interact.tab";

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
