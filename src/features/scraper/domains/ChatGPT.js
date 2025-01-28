import {safeExecute} from "../../../core/utils/jsShorteners";
import {extractSources} from "../../../core/services/pageExtractor/extractSources";
import {capitalizeFirst} from "../../../core/services/format/formatText";

export async function processMessage(content, format, metadata) {
  const messageSelector = content.querySelector("article [data-message-author-role]");

  const entityName = messageSelector?.getAttribute("data-message-author-role") === "assistant"
    ? "ChatGPT"
    : "User";

  const msgTitle = "## " + capitalizeFirst(entityName ?? "") + "\n";

  const sources = await safeExecute(extractSources(content, format, metadata.sourcesExtraction));

  return msgTitle + format(messageSelector?.innerHTML ?? "") + sources + "\n";
}
