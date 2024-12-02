import {capitalizeFirst} from "../../../format/formatText";

export async function processMessage(content, format, metadata) {
  const messageSelector = content;

  const entityName = messageSelector?.querySelector("[data-is-streaming]")
    ? "Claude"
    : "User";

  const msgTitle = "## " + capitalizeFirst(entityName ?? "") + "\n";

  return msgTitle + format(messageSelector?.innerHTML ?? "") + "\n";
}
