import {capitalizeFirst} from "../../../core/services/format/formatText";

export async function processMessage(content, format, metadata) {
  const messageSelector = content.querySelector("[data-testid=\"user-message\"], [data-is-streaming] > div");
  const inputsSelector = content.querySelectorAll('[data-testid=\"file-thumbnail\"]');

  const entityName = content?.querySelector("[data-is-streaming]")
    ? "Claude"
    : "User";

  const msgTitle = "## " + capitalizeFirst(entityName ?? "") + "\n";

  let inputsText = "##### Content:\n";
  inputsText += Array.from(inputsSelector).map((input) => {
    const text = input?.querySelector(".shrink.flex")?.textContent ?? "Input";
    return `{{@CAPTURE_INPUT_CONTENT:${text}}}`;
  }).join("\n");

  return msgTitle
    + format(messageSelector?.innerHTML ?? "")
    + (inputsSelector.length > 0 ? '\n\n' + inputsText : "")
    + "\n";
}
