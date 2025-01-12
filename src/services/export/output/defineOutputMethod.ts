import {download, sendToWebhook} from "./outputMethods";

/**
 * Exports the given content using export methods
 * @param domain domain of the page
 * @param extracted extracted content
 * @returns {Promise<void>}
 */

export async function defineOutputMethod(domain: { name: string; url: any; }, {markdownContent, fileName}: { title: string; fileName: any; markdownContent: BlobPart; }): Promise<void> {

  // Download the file locally
  await download(markdownContent, fileName);

  // Send the file to the webhook
  await sendToWebhook(markdownContent, fileName);

  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}
