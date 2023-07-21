import {download, saveToClipboard} from "./exportMethods";

export async function exporter(markdownContent, title) {
  download(markdownContent, title);
  // await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}