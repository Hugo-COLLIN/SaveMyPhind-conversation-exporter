import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import ExtractorSourcesPhindChat from "../sources/ExtractorSourcesPhindChat";
import {getPageTitle} from "../extractMetadata";
import {Extractor} from "./Extractor";

async function processPhindChatMessage(content, format) {
  const allDivs = content.querySelectorAll('.col > div > div > div, textarea');
  const msgContent = Array.from(allDivs).filter(elt => (elt.children.length > 0 && elt.children.item(0).tagName !== "A") || elt.tagName === "TEXTAREA");
  const searchResults = content.querySelectorAll('.col > div > div > div:nth-last-of-type(1) > div > a');
  const entityName = content.querySelectorAll('.col > div > div > span');

  if (msgContent.length === 0) return "";

  let res = "";

  // Extract writer name
  if (entityName.length > 0) {
    res += "## ";
    let putSeparator = true;
    entityName.forEach((elt) => {
      res += format(elt.innerHTML);
      if (entityName.length > 1 && entityName[1].innerHTML !== "" && putSeparator) {
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
    res += "---\n**Sources:**";

    if (msgContent[2]) {
      res = await new ExtractorSourcesPhindChat().extractSources(msgContent, searchResults, res, format);
    } else {
      let i = 1;
      searchResults.forEach((link) => {
        res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
        i++;
      });
    }

    res += "\n";

  } else { // If there are no search results
    msgContent.forEach((elt) => {
      res += format(elt.children.item(0).innerHTML) + "\n";
    });
  }

  return res;
}

async function process(format) {
  const messages = document.querySelectorAll('[name^="answer-"]');
  let markdown = await safeExecute(setFileHeader(getPageTitle('[tabindex="0"]', {
    action: 'replace',
    params: [/\u00A0/g, " "]
  }), "Phind Chat"));

  for (const content of messages) {
    const messageText = await processPhindChatMessage(content, format, markdown);
    if (messageText !== "") markdown += messageText + "\n\n";
  }

  return markdown;
}

export default class ExtractorPhindChat extends Extractor {
  async extractPage(format) {
    return await process(format);
  }
}
