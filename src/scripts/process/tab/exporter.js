import {download, saveToClipboard} from "../../units/processing/export-methods/exportMethods.tab";

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
