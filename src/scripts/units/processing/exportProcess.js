import {logWelcome} from "../utils/consoleMessages.all";
import appInfos from "../../../infos.json";


import {updateClickIconCount} from "../interface/modals/clickCount.all";
import {download} from "./export-methods/exportMethods.tab";

/**
 * Exports the given content using export methods
 * @param domain domain of the page
 * @param extracted extracted content
 * @returns {Promise<void>}
 */
export async function exportContent(domain, extracted) {
  const {markdownContent, fileName} = extracted;
  await download(markdownContent, fileName);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}

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

async function defineExtractor(domain) {
  let module;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`../../units/processing/scraper/ExtractorPhindSearch.tab`);
      break;
    case "PhindChat":
      module = await import(`../../units/processing/scraper/ExtractorPhindChat.tab`);
      break;
    case "Perplexity":
      module = await import(`../../units/processing/scraper/ExtractorPerplexity.tab`);
      break;
    case "MaxAIGoogle":
      module = await import(`../../units/processing/scraper/ExtractorMaxAIGoogle.tab`);
      break;
    default:
      module = await import(`../../units/processing/scraper/ExtractorArbitraryPage.tab`);
  }
  return new module.default();
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
