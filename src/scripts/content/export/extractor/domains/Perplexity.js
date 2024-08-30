import {safeExecute} from "../../../../shared/utils/jsShorteners";
import {extractSources} from "../extractSources";

/**
 * Extracts the content of a message from Perplexity
 * @param content {HTMLElement}
 * @param format {(text: string) => string}
 * @returns {Promise<string>}
 */
export async function processMessage(content, format) {
  if (!content.hasChildNodes()) return "";
  const question = content.querySelector('.break-words');
  if (!question) return "";
  let markdown = "## User\n";
  const questionText = (question && question.innerText ? question.innerText : "") + "\n\n";
  markdown += questionText.replace(/(?<!`)<(?!`)/g, '\\<').replace(/(?<!`)>(?!`)/g, '\\>');

  const answer = content.querySelector(".relative.default > div > div");
  const answerer = content.querySelector(".mb-lg .flex.items-center > p");
  markdown += answerer && answerer.innerHTML.toLowerCase().includes('pro')
    ? "## Pro answer\n"
    : "## AI answer\n";
  markdown += format(answer.innerHTML) + "\n\n";

  // Display analysis section
  // const analysis = content.querySelectorAll('.space-y-md.mt-md > div');
  // for (const analysisSection of analysis) {
  //   const sectionTitle = analysisSection.querySelectorAll('div.taco .default')[1];
  //   const sectionContent = analysisSection.querySelector('div.grow');
  //   if (sectionTitle && analysisSection.querySelector(".grid") === null) markdown += "**" + format(sectionTitle.innerText) + ":**\n";
  //   if (sectionContent !== null && sectionContent.querySelector(".grid") === null) markdown += format(sectionContent.innerHTML) + "\n\n";
  // }
  // if (analysis[0].querySelector(".grid") !== null) markdown += "**Quick search:**\n";

  // Display sources
  const data = {
    selectors: [
      {
        open: [{
          selector: 'button > div > svg[data-icon="ellipsis"]',
          scope: 'content'
        }, {
          selector: '.cursor-pointer [data-icon="sources"]',
          scope: 'document'
        }],
        close: [{selector: '[data-testid="close-modal"]', scope: 'document'}],
        selector: '.fixed > div > [class] > div > div > div > div > div > .group',
        extractionType: 'list'
      },
      {
        open: [{selector: 'div.grid > div.flex:nth-last-of-type(1)', scope: 'content'}],
        close: [{selector: '[data-testid="close-modal"]', scope: 'document'}],
        selector: '.fixed > div > [class] > div > div > div > div > div > .group',
        extractionType: 'list'
      },
      {
        selector: 'div.grid > div.flex',
        extractionType: 'tile-list'
      }
    ]
  };
  const src = await safeExecute(await extractSources(content, format, data));
  if (src !== null) markdown += src + "\n";

  return markdown;
}


