import {safeExecute} from "../../shared/utils/jsShorteners";
import {setFileHeader} from "../../shared/formatter/formatMarkdown";

export async function extractPageCommon(format, metadata, processMessageContent, getPageTitleSelector) {
  const messages = document.querySelectorAll(getPageTitleSelector);
  let markdown = await safeExecute(setFileHeader(metadata.pageTitle, metadata.domainName));

  for (const content of messages) {
    const messageText = await processMessageContent(content, format);
    if (messageText !== "") markdown += messageText + "\n";
  }

  return markdown;
}
