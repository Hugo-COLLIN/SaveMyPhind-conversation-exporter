import {logWelcome} from "../../core/utils/consoleMessages";
import appInfos from "../../data/infos.json";
import {extractPage} from "./extractPage";
import {defineOutputMethod} from "./output/defineOutputMethod";
import {updateClickIconCount} from "../browser/icon/clickCount";
import {safeExecute} from "../../core/utils/jsShorteners";
import {handleModalDisplay} from "../../core/components/modals/cs/actions/displayCtaModals";
import {getStorageData} from "../../core/utils/chromeStorage";
import ModalMessage from "../../core/components/modals/cs/types/ModalMessage";

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

export function SCRAPER_FALLBACK_ACTION() {
  return async (error: any) => {
    await new ModalMessage('../files/modalMessages/modalError.md').appendModal();
    throw error;
  };
}

export function EXPORTER_FALLBACK_ACTION() {
  return (error: { stack: string; }) => {
    // @ts-ignore TODO variables at compile time
    alert(`${appInfos.APP_SNAME}: File conversion error.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    throw new Error("File conversion error:\n" + error.stack);
  };
}
