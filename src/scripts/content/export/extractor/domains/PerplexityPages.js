import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "./Perplexity";

export async function processMessage(content, format) {
  if (!content.hasChildNodes())
    return '';

  let markdown = '';

  const title = content.querySelector('h2 > span');
  markdown += title
    ? `## ${title?.innerText}\n`
    : '';

  const answer = content.querySelector('.flex-col > div .font-sans .break-words, [class="group/section"] .prose'); // first one selects the intro, second one the other article parts
  markdown += answer?.innerHTML && answer?.innerHTML !== ''
    ? format(answer?.innerHTML) + '\n\n'
    : '';

  // Display sources
  const data = {
    selectors: [
      {
        open: [{selector: 'div.grid > div.flex:nth-last-of-type(1), .group\\/source', scope: 'content'}],
        close: [],
        selector: 'TODO'
      },
    ],
    afterAction: '[data-testid="close-modal"]'
  };
  const src = await safeExecute(await extractSources(content, format, data));
  if (src && src !== '')
    markdown += src + "\n";

  return markdown;
}
