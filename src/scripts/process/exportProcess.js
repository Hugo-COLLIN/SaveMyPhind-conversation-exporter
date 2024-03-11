import {logWelcome} from "../units/utils/consoleMessages";
import {exportContent} from "../units/exporter/exporter";
import {clickOnListElt} from "../units/interactDOM/interact";
import appInfos from "../../infos.json";


import {updateClickIconCount} from "../units/modals/clickCount";

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
      module = await import(`../units/scraper/ExtractorPhindSearch`);
      break;
    case "PhindChat":
      module = await import(`../units/scraper/ExtractorPhindChat`);
      break;
    case "Perplexity":
      module = await import(`../units/scraper/ExtractorPerplexity`);
      break;
    case "MaxAIGoogle":
      module = await import(`../units/scraper/ExtractorMaxAIGoogle`);
      break;
    default:
      module = await import(`../units/scraper/ExtractorArbitraryPage`);
  }
  return new module.default();
  // let extractor = await import(`./Extractor${domain.name}`);
}
