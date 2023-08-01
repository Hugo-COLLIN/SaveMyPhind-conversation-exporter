import {domainChecker} from "./checker/domainChecker";
import {logWelcome} from "../storedData/consoleMessages";
import {setFormatRules} from "./ruler/ruler";
import {extract} from "./extractor/extractor";
import {exportContent} from "./exporter/exporter";

/**
 * @description - Launch the export process
 * @returns {Promise<void>}
 */
export async function launchExport() {
  const domain = await domainChecker();
  if (domain === null) return;

  logWelcome();
  setFormatRules(domain.name);
  const extracted = await extract(domain);

  if (extracted === null) return;

  await exportContent(domain, extracted);
  console.log("Export done!")
}