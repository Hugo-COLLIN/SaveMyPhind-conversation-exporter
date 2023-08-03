import {domainChecker} from "./checker/domainChecker";
import {logWelcome} from "../utils/consoleMessages";
import {setFormatRules} from "./ruler/ruler";
import {extract} from "./extractor/extractor";
import {exportContent} from "./exporter/exporter";
import {clickOnListElt} from "../utils/webpage/interact";

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchExport() {
  const domain = await domainChecker();
  if (domain === null) return;

  logWelcome();
  setFormatRules(domain.name);
  const extracted = await extract(domain);

  if (extracted === null) return;

  await exportContent(domain, extracted);
  console.log("Export done!")
}

export function autoScrapOnLoad() {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === 'executeScript') {
      if (request.index > 0) launchExport();
      clickOnListElt(request.index)
      setTimeout(function () {
        sendResponse({message: 'scriptExecuted'});
      }, 1);
    }
    return true; // will respond asynchronously
  });
}