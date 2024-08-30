import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "../extractSources";

export async function processMessage(content, format, metadata) {
  if (!content.hasChildNodes())
    return '';

  let markdown = '';

  const title = content.querySelector('h2 > span');
  markdown += title
    ? `## ${title?.innerText}\n`
    : '';

  const image = content.querySelector('.flex-col > div > .group\\/section > :first-child img');
  const answer = content.querySelector('.flex-col > div .font-sans .break-words, [class="group/section"] .prose'); // first one selects the intro, second one the other article parts

  const htmlOutput = (image ? image.outerHTML + "<br><br>" : "") + answer?.innerHTML
  markdown += answer?.innerHTML && answer?.innerHTML !== ''
    ? format(htmlOutput) + '\n'
    : '';

  const src = await safeExecute(await extractSources(content, format, metadata.sourcesExtraction));
  if (src && src !== '')
    markdown += src + "\n";

  return markdown;
}
