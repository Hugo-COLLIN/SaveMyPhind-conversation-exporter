import {formatLink, setFileHeader} from "../../../../core/services/format/formatMarkdown";
import {safeExecute} from "../../../../core/utils/jsShorteners";
import {getPageTitle} from "../extractPageMetadata";

export const turndown = {};

/**
 * TODO: Chatbot name before answer + get title from MaxAI query, not from google textarea (differences)
 */
async function extractPageContent(format) {
  const hostElement = document.querySelector('[id^=MAXAI]');
  if (hostElement === null) return null;
  const shadowRoot = hostElement.shadowRoot;

  const selectAnswer = shadowRoot.querySelector('.search-with-ai--text');
  if (selectAnswer === null) return null;

  let selectSources = shadowRoot.querySelector('[class*=--MuiGrid-container]');
  if (selectSources) selectSources = selectSources.childNodes

  let markdown = await safeExecute(setFileHeader(getPageTitle(), "MaxAI in Google"));
  markdown += "## Answer\n" + format(selectAnswer.innerHTML) + "\n\n";
  markdown += "---\n**Sources:**\n";
  let i = 1;
  selectSources.forEach((elt) => {
    const text = elt.querySelector("a p")
    const url = elt.querySelector("a").href;
    if (text !== null) markdown += "- " + formatLink(url, i + ". " + text.innerHTML) + "\n";
    i++;
  });
  markdown += "\n\n";

  return markdown;
}
