import {Extractor} from "./Extractor";
import {initTurndown, setFileHeader, turndownConverter} from "../../../shared/formatter/formatMarkdown";
import {safeExecute, sleep} from "../../../shared/utils/jsShorteners";
import ExtractorSourcesPerplexity from "../sources/ExtractorSourcesPerplexity";
import {getPageTitle} from "../extractMetadata";

export const metadata = {
  title: getPageTitle(), //".mb-md:nth-of-type(1) > div"
  source: "Perplexity.ai"
};

export default class ExtractorPerplexity extends Extractor {
  async extractPage(format) {
    const messages = document.querySelectorAll('main .mx-auto > div > div > div > div > div');
    let markdown = await safeExecute(setFileHeader(getPageTitle(), "Perplexity.ai"));

    for (const content of messages) {
      if (!content.hasChildNodes()) continue;
      // Display question
      const question = content.querySelector('.break-words');
      if (!question) continue;
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
    }

    return markdown;
  }

  extractMetadata() {
    return metadata
  }

  applyExtractorRules() {
    initTurndown({
      blankReplacement: function(content, node) {
        if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
          return '\n\n';
        } else {
          return '';
        }
      }
    });

    turndownConverter.addRule('preserveLineBreaksInPre', {
      filter: function (node) {
        return node.nodeName === 'PRE' && node.querySelector('div');
      },
      replacement: function (content, node) {
        const codeBlock = node.querySelector('code');
        const codeContent = codeBlock.textContent.trim();
        const codeLang = codeBlock.parentNode.parentNode.parentNode.querySelector("div").textContent.trim();
        return ('\n```' + codeLang + '\n' + codeContent + '\n```');
      }
    });

    turndownConverter.addRule('formatCitationsInAnswer', {
      filter: function (node) {
        return node.getAttribute('class') && node.getAttribute('class').split(" ").includes('citation');
      },
      replacement: function (content, node) {
        const citationText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '').replace(/\n/g, '');

        if (node.nodeName === 'A') {
          const href = node.getAttribute('href');
          return ' [' + citationText + '](' + href + ')';
        }
        else {
          return ' [' + citationText + ']';
        }
      }
    });
  }
}
