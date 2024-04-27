import {download} from "./export/exportMethods.tab";

/**
 * Exports the given content using export methods
 * @param domain domain of the page
 * @param extracted extracted content
 * @returns {Promise<void>}
 */
export async function defineExportMethod(domain, {markdownContent, fileName}) {
  await download(markdownContent, fileName);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}
