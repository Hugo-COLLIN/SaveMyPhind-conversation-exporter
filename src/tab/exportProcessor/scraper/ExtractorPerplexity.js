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
        markdown += "---\n**Sources:**\n" + src + "\n";
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
    let res = "";

    const btn = content.querySelector("div.grid > div.flex");

    // for (const btn of content.querySelectorAll("div.flex > button")) {
    //   if (btn.querySelector("span") && btn.querySelector("span").innerText === "View Sources") {
        btn.click();
        await sleep(10);

        let i = 1;
        for (const result of content.querySelectorAll("div.grid > a")) {
          // const link = result.querySelector("a");
          const text = "(" + i + ") " + format(result.querySelector("div.default").innerText.replaceAll("\n", " ").replaceAll('"', ''));
          res += "- " + (result ? formatLink(result.href, text) : text) + "\n";
          i ++;
        }

        // const btnQuit = document.querySelector("main > .justify-center.items-center button.bg-super");
        // btnQuit.click();
        // await sleep(1);

        return res;
      // }
    //
    // }
    // return null;
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

    turndownConverter.addRule('formatLinks', {
      filter: 'a',
      replacement: function (content, node) {
        const href = node.getAttribute('href');
        const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '').replace(/\n/g, '');
        return ' [' + linkText + '](' + href + ')';
      }
    });
  }
}
