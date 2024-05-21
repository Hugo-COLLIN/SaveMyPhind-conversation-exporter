import {Extractor} from "./Extractor";
import {setFileHeader} from "../../../shared/formatter/formatMarkdown";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import ExtractorSourcesPerplexity from "../sources/ExtractorSourcesPerplexity";
import {getPageTitle} from "../extractMetadata";

async function processPerplexityMessage(content, markdown, format) {
  if (!content.hasChildNodes()) return;
  // Display question
  const question = content.querySelector('.break-words');
  if (!question) return;
  markdown += "## User\n";
  const questionText = (question && question.innerText ? question.innerText : "") + "\n\n";
  markdown += questionText.replace(/(?<!`)<(?!`)/g, '\\<').replace(/(?<!`)>(?!`)/g, '\\>');

  // Display answer
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
  const src = await new ExtractorSourcesPerplexity().extractSources(content, format);
  if (src !== null)
    markdown += src + "\n";
  return markdown;
}

async function process(format) {
  const messages = document.querySelectorAll('main .mx-auto > div > div > div > div > div');
  let markdown = await safeExecute(setFileHeader(getPageTitle(), "Perplexity.ai"));

  for (const content of messages) {
    markdown = await processPerplexityMessage(content, markdown, format);
  }

  return markdown;
}

export default class ExtractorPerplexity extends Extractor {
  async extractPage(format) {
    return await process(format);
  }
}
