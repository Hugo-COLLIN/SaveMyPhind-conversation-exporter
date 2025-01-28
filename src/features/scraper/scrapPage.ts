import {logWelcome} from "../../core/utils/consoleMessages";
import appInfos from "../../data/infos.json";
import {extractPage} from "./extractPage";
import {defineOutputMethod} from "./output/defineOutputMethod";
import {updateClickIconCount} from "../browser/icon/clickCount";
import {safeExecute} from "../../core/utils/jsShorteners";
import {EXPORTER_FALLBACK_ACTION, SCRAPER_FALLBACK_ACTION} from "../fallbackActions";
import {handleModalDisplay} from "../../core/components/modals/cs/actions/displayCtaModals";
import {getStorageData} from "../../core/utils/chromeStorage";

export async function scrapPage() {
  const domainPage = await getStorageData("domainPage", "local") as { name: string; url: any; };
  await safeExecute(async () => {
    await launchScrapping(domainPage);
    handleModalDisplay();
  }, SCRAPER_FALLBACK_ACTION());
}

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchScrapping(domain: { name: string; url: any; }): Promise<void> {
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
