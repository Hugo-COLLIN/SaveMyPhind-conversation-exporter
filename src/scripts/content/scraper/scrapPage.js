import {logWelcome} from "../../shared/utils/consoleMessages";
import appInfos from "../../../infos.json";
import {defineExtractor} from "../extractor/defineExtractor";
import {defineExportMethod} from "../export/defineExportMethod";
import {updateClickIconCount} from "../../background/icon/clickCount/clickIconCountContext";
import {safeExecute} from "../../shared/utils/jsShorteners";

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchScrapping(domain) {
  logWelcome();
  const extractor = await defineExtractor(domain);
  const extracted = await safeExecute(extractor.launch(), (error) => {
    // console.error(error);
    alert(`${appInfos.APP_SNAME}: Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    throw error;
  });

  if (!extracted || extracted.markdownContent === null) {
    console.info("No content to export!");
    alert(`${appInfos.APP_SNAME}: No content to export!`);
    return;
  }

  await defineExportMethod(domain, extracted);
  console.log("Export done!")

  // Increment click icon count
  updateClickIconCount();
}
