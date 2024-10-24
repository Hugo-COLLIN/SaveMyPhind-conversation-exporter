import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "../extractSources";
import {capitalizeFirst} from "../../../../../services/format/formatText";

export async function processMessage(content, format, metadata) {
  const messageSelector = content.querySelector("article [data-message-author-role]");

  const entityName = messageSelector?.getAttribute("data-message-author-role") === "assistant"
    ? "ChatGPT"
    : "User";

  const msgTitle = "## " + capitalizeFirst(entityName ?? "") + "\n";

  const sources = await safeExecute(extractSources(content, format, metadata.sourcesExtraction));

  return msgTitle + format(messageSelector?.innerHTML ?? "") + sources + "\n";
}
