import {safeExecute, sleep} from "../../../shared/utils/jsShorteners";
import {extractSources} from "./Perplexity";

export async function processMessage(content, format) {
  if (!content.hasChildNodes()) return "";
  let markdown = "";
  const title = content.querySelector('h2 > span');
  markdown += title ? `## ${title?.innerText}\n` : "";

  const answer = content.querySelector('.flex-col > div > .relative > :first-child, [class="group/section"] .prose'); // first one selects the intro, second one the other article parts
  markdown += format(answer?.innerHTML || '');

  // Display sources
  const src = await safeExecute(await extractSources(content, format));
  if (src !== null) markdown += src + "\n";

  return markdown;
}
