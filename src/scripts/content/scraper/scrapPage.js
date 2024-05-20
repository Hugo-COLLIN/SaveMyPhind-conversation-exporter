import {logWelcome} from "../../shared/utils/consoleMessages";
import appInfos from "../../../infos.json";
import {defineExtractor} from "../extractor/defineExtractor";
import {defineExportMethod} from "../export/defineExportMethod";
import {updateClickIconCount} from "../../background/icon/clickCount/clickIconCountContext";
import {safeExecute} from "../../shared/utils/jsShorteners";
import {EXPORTER_FALLBACK_ACTION, EXTRACTOR_FALLBACK_ACTION} from "./fallbackActions";
import {formatFilename} from "../../shared/formatter/formatText";
import {applyExtractorRules} from "../extractor/applyRules";

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchScrapping(domain) {
  logWelcome();
  const {default: extractor, metadata, rules} = await defineExtractor(domain);
  applyExtractorRules(rules);
  const extracted = {
    title: metadata.pageTitle,
    fileName: formatFilename(metadata.pageTitle, metadata.domainName),
    markdownContent: await safeExecute(extractor.launch(), EXTRACTOR_FALLBACK_ACTION()),
  };

  if (!extracted || extracted.markdownContent === null) {
    console.info("No content to export!");
    alert(`${appInfos.APP_SNAME}: No content to export!`);
    return;
  }

  await safeExecute(defineExportMethod(domain, extracted), EXPORTER_FALLBACK_ACTION());
  console.log("Export done!")

  // Increment click icon count
  updateClickIconCount();
}
