import {logWelcome} from "../../../shared/utils/consoleMessages";
import appInfos from "../../../../data/infos.json";
import {extractPage} from "../extractor/extractPage";
import {defineOutputMethod} from "../output/defineOutputMethod";
import {updateClickIconCount} from "../../../background/interface/icon/clickCount";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import {EXPORTER_FALLBACK_ACTION} from "../../utils/fallbackActions";

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchScrapping(domain) {
  logWelcome();
  const extracted = await extractPage(domain);

  if (!extracted || extracted.markdownContent === null) {
    console.info("No content to export!");
    alert(`${appInfos.APP_SNAME}: No content to export!`);
    return;
  }

  await safeExecute(defineOutputMethod(domain, extracted), EXPORTER_FALLBACK_ACTION());
  console.log("Export done!")

  // Increment click icon count
  updateClickIconCount();
}
