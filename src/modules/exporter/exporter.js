import {download, saveToClipboard} from "./export";

export async function exporter(markdownContent, title) {
  download(markdownContent, title);
  await saveToClipboard(markdownContent);
  // linksToObsidian(markdownContent);
}