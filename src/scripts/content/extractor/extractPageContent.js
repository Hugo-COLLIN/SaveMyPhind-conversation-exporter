import {safeExecute} from "../../shared/utils/jsShorteners";
import {setFileHeader} from "../../shared/formatter/formatMarkdown";

export async function extractPageContent(format, metadata, processMessageContent) {
  const messages = document.querySelectorAll(metadata.contentSelector);
  let markdown = await safeExecute(setFileHeader(metadata.pageTitle, metadata.domainName));

  for (const content of messages) {
    const messageText = await processMessageContent(content, format);
    if (messageText !== "") markdown += messageText + "\n";
  }

  return markdown;
}
