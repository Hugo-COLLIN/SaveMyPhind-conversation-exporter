import {safeExecute} from "../../../shared/utils/jsShorteners";
import {interactAndCatch, SOURCES_HEADER} from "./Perplexity";

export async function processMessage(content, format) {
  if (!content.hasChildNodes())
    return '';

  let markdown = '';

  const title = content.querySelector('h2 > span');
  markdown += title
    ? `## ${title?.innerText}\n`
    : '';

  const answer = content.querySelector('.flex-col > div > .relative > :first-child, [class="group/section"] .prose'); // first one selects the intro, second one the other article parts
  markdown += answer?.innerHTML && answer?.innerHTML !== ''
    ? format(answer?.innerHTML) + '\n\n'
    : '';

  // Display sources
  const src = await safeExecute(await extractSources(content, format));
  if (src && src !== '')
    markdown += src + "\n";

  return markdown;
}

async function extractSources(content, format) {
  return await interactAndCatch(content, [
    {
      open: [{selector: 'div.grid > div.flex:nth-last-of-type(1), .group\\/source', scope: 'content'}],
      close: [],
      selector: 'TODO'
    },
  ], SOURCES_HEADER, format, '[data-testid="close-modal"]') || '';
}
