import {logWelcome} from "../../units/utils/consoleMessages.all";
import {exportContent} from "./exporter";
import {clickOnListElt} from "../../units/interact-DOM/interact.tab";
import appInfos from "../../../infos.json";


import {updateClickIconCount} from "../../units/modals/clickCount.all";

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchExport(domain) {
  logWelcome();
  const extractor = await defineExtractor(domain);
  const extracted = await extractor.launch();

  if (extracted.markdownContent === null) {
    alert(`${appInfos.APP_SNAME}: No content to export!`);
    return;
  }

  await exportContent(domain, extracted);
  console.log("Export done!")

  // Increment click icon count
  updateClickIconCount();
}

export function scrapOnLoadListener(domain) {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === 'executeScript') {
      if (request.index > 0) launchExport(domain);
      clickOnListElt(request.index)
      setTimeout(function () {
        sendResponse({message: 'scriptExecuted'});
      }, 1);
    }
    return true; // will respond asynchronously
  });
}

async function defineExtractor(domain) {
  let module;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`../../units/scraper/ExtractorPhindSearch.tab`);
      break;
    case "PhindChat":
      module = await import(`../../units/scraper/ExtractorPhindChat.tab`);
      break;
    case "Perplexity":
      module = await import(`../../units/scraper/ExtractorPerplexity.tab`);
      break;
    case "MaxAIGoogle":
      module = await import(`../../units/scraper/ExtractorMaxAIGoogle.tab`);
      break;
    default:
      module = await import(`../../units/scraper/ExtractorArbitraryPage.tab`);
  }
  return new module.default();
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
