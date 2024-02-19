import {Extractor} from "./Extractor";
import {formatLineBreaks} from "../formatter/formatText";
import {formatLink, initTurndown, setFileHeader, turndownConverter} from "../formatter/formatMarkdown";
import {sleep} from "../../../common/utils/utils";

export default class ExtractorPerplexity extends Extractor {
  async extractPage(format) {
    const messages = document.querySelectorAll('#ppl-message-scroll-target > div > div:nth-of-type(2) > [class]');
    let markdown = await setFileHeader(this.getPageTitle(), "Perplexity.ai");

    for (const content of messages) {
      // Display question
      const question = content.querySelector('.break-words');
      markdown += "## User\n";
      const regex = /<div class="break-words \[word-break:break-word] whitespace-pre-line whitespace-pre-wrap default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-super selection:text-white dark:selection:bg-opacity-50 selection:bg-opacity-70">([\s\S]*?)<\/div>/
      const questionText = formatLineBreaks(question.innerText ?? "", regex) + "\n\n";
      markdown += questionText.replace(/(?<!`)<(?!`)/g, '\\<').replace(/(?<!`)>(?!`)/g, '\\>');

      // Display answer
      const answer = content.querySelector(".relative.default > div > div")
      const answerer = content.querySelector(".mb-lg .flex.items-center > p");
      markdown += !answerer ?
        "## AI answer\n"
        : answerer.innerHTML.toLowerCase().includes('copilot') ?
          "## Copilot answer\n"
          : answerer.toLowerCase().includes('search') ?
            "## Quick answer\n"
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
      const src = await this.extractSources(content, format);
      if (src !== null)
        markdown += src + "\n";
    }

    return markdown;
  }

  getPageTitle() {
    // return document.querySelector(".mb-md:nth-of-type(1) > div").innerHTML ?? "";
    return document.title;
  }

  getPageSource() {
    return "Perplexity.ai";
  }

  async extractSources(content, format) {
    const btnExpandSources = content.querySelector("div.grid > div.flex:nth-last-of-type(1)"); // Get the last button, useful when uploaded file div
    if (!btnExpandSources) return "";

    btnExpandSources.click();
    await sleep(10);

    let res = "---\n**Sources:**\n"
    let i = 1;

    // Case the first tile is a file, not a link
    const tilesNoLink = content.querySelectorAll("div.grid > div.flex");
    for (const tile of tilesNoLink) {
      if (tile.querySelectorAll("img").length === 0)
      {
        res = this.formatSources(i, format, tile, res);
        i ++;
      }
    }

    // Link tiles
    for (const tile of content.querySelectorAll("div.grid > a")) {
      res = this.formatSources(i, format, tile, res);
      i ++;
    }
    return res;
  }


  formatSources(i, format, tile, res) {
    const text = "(" + i + ") " + format(tile.querySelector("div.default").innerText.replaceAll("\n", " ").replaceAll('"', ''));
    res += "- " + (tile && tile.href ? formatLink(tile.href, text) : text) + "\n";
    return res;
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
