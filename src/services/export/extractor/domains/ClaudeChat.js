import {capitalizeFirst} from "../../../format/formatText";

export async function processMessage(content, format, metadata) {
  const messageSelector = content.querySelector("[data-testid=\"user-message\"], [data-is-streaming] > div");

  const entityName = content?.querySelector("[data-is-streaming]")
    ? "Claude"
    : "User";

  const msgTitle = "## " + capitalizeFirst(entityName ?? "") + "\n";

  return msgTitle + format(messageSelector?.innerHTML ?? "") + "\n";
}
