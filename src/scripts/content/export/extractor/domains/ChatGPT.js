import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "../extractSources";
import {capitalizeFirst} from "../../../../shared/formatter/formatText";

export async function processMessage(content, format, metadata) {
  const messageSelector = content.querySelector("article [data-message-author-role]");

  const entityName = messageSelector?.getAttribute("data-message-author-role") === "assistant"
    ? "ChatGPT"
    : "User";

  const msgTitle = "## " + capitalizeFirst(entityName ?? "") + "\n";

  return msgTitle + format(messageSelector?.innerHTML ?? "");

  const allDivs = content.querySelectorAll('.col > div > div > div, textarea');
  const msgContent = Array.from(allDivs).filter(elt => (elt.children.length > 0 && elt.children.item(0).tagName !== "A") || elt.tagName === "TEXTAREA");
  const searchResults = content.querySelectorAll('.col > div > div > div:nth-last-of-type(1) > div > a');
  // const entityName = content.querySelectorAll('.col > div > div > span');

  if (msgContent.length === 0) return "";

  let res = "";

  // Extract writer name
  if (entityNameSelector.length > 0) {
    res += "## ";
    let putSeparator = true;
    entityNameSelector.forEach((elt) => {
      res += format(elt.innerHTML);
      if (entityNameSelector.length > 1 && entityNameSelector[1].innerHTML !== "" && putSeparator) {
        res += " - ";
        putSeparator = false;
      }
    });
    res += "\n";
  }

  // Extract message
  if (searchResults.length > 0) // If there are search results
  {
    // Message
    res += format(msgContent[0].innerHTML) + "\n";

    // Export search results
    res += await safeExecute(extractSources(content, format, metadata.sourcesExtraction));

  } else { // If there are no search results, export each component of the message
    msgContent.forEach((elt) => {
      const filteredElt = [...elt.children].filter((child) => !child.querySelector("button[style=\"display: none;\"]"));
      res += format(filteredElt.map((child) => child.innerHTML).join("\n")) + "\n";
    });
  }

  return res;
}
