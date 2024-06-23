import {safeExecute} from "../../../shared/utils/jsShorteners";
import {interactAndCatch} from "./Perplexity";

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

async function extractSources(content, format) {
  const SOURCES_HEADER = "\n\n---\n**Sources:**\n";
  let res = SOURCES_HEADER;

  // Open sources modal
  res = await interactAndCatch(content, [
    {open: ['.group\\/source'], close: ['[data-testid="close-modal"]'], selector: 'TODO'},
  ], res, format);

  // Don't export header if no sources
  return res !== SOURCES_HEADER
    ? res
    : "";
}
