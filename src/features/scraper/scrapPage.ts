import {logWelcome} from "../../core/utils/consoleMessages";
import appInfos from "../../data/infos.json";
import {extractPage} from "./extractPage";
import {safeExecute} from "../../core/utils/jsShorteners";
import {handleModalDisplay} from "../../core/components/modals/cs/actions/displayCtaModals";
import {getStorageData} from "../../core/utils/chromeStorage";
import ModalMessage from "../../core/components/modals/cs/types/ModalMessage";
import {contentScriptDownload} from "../../core/services/outputMethods/outputMethods";

export async function scrapPage() {
  const domainPage = await getStorageData("domainPage", "local") as { name: string; url: any; };
  await safeExecute(async () => {
    await launchScrapping(domainPage);
    handleModalDisplay();
  }, SCRAPER_FALLBACK_ACTION());
}

export async function launchScrapping(domain: { name: string; url: any; }): Promise<void> {
  logWelcome();
  const extracted = await extractPage(domain);

  if (!extracted || extracted.markdownContent === null) {
    console.info("No content to export!");
    alert(`${appInfos.APP_SNAME}: No content to export!`);
    return;
  }

  // Envoyer les données extraites au background
  await chrome.runtime.sendMessage({
    type: 'EXPORT_CONTENT',
    payload: {
      domain,
      extracted
    }
  });

  //TODO temporary download from content-script
  contentScriptDownload(extracted.markdownContent, extracted.fileName);

  console.log("Export done!")
}

export function SCRAPER_FALLBACK_ACTION() {
  return async (error: any) => {
    await new ModalMessage('../files/modalMessages/modalError.md').appendModal();
    throw error;
  };
}
