import {logWelcome} from "../../units/utils/consoleMessages.all";
import appInfos from "../../../infos.json";
import {updateClickIconCount} from "../../units/interface/modals/clickCount.all";
import {defineExtractor} from "../../units/processing/defineExtractor";
import {exportContent} from "./steps/exportContent";

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
