import {download} from "../../../core/services/outputMethods/outputMethods";

/**
 * Exports the given content using export methods
 * @param domain domain of the page
 * @param extracted extracted content
 * @returns {Promise<void>}
 */
export async function defineOutputMethod(domain: { name: string; url: any; }, {markdownContent, fileName}: { title: string; fileName: any; markdownContent: string; }): Promise<void> {
  await download(markdownContent, fileName);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}
