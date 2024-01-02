import {Extractor} from "./Extractor";
import {formatLineBreaks} from "../formatter/formatText";
import {formatLink, initTurndown, setFileHeader, turndownConverter} from "../formatter/formatMarkdown";
import {sleep} from "../../../common/utils";

export default class ExtractorPerplexity extends Extractor {
  constructor(domain) {
    super(domain);
  }

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
    for (const btn of content.querySelectorAll("div.flex > button")) {
      if (btn.querySelector("span") && btn.querySelector("span").innerText === "View Sources") {
        btn.click();
        await sleep(10);

        let i = 1;
        for (const result of document.querySelectorAll("main > .justify-center.items-center .py-md .py-md")) {
          const link = result.querySelector("a");
          const text = "(" + i + ") " + format(result.querySelector("div.default > div").innerText.replaceAll("\n", " ").replaceAll('"', ''));
          res += "- " + (link ? formatLink(link.href, text) : text) + "\n";
          i ++;
        }

        const btnQuit = document.querySelector("main > .justify-center.items-center button.bg-super");
        btnQuit.click();
        await sleep(1);

        return res;
      }

    }
    return null;
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

    // turndownConverter = new TurndownService({
    //   blankReplacement: function(content, node) {
    //     if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
    //       return '\n\n';
    //     } else {
    //       return '';
    //     }
    //   }
    // });

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

    // turndownConverter.addRule('transformSpan', {
    //   filter: "span",
    //   replacement: function(content, node) {
    //     console.log(node)
    //     return node.getAttribute('class') === 'block mt-md' ? '\n\n' : content;
    //   }
    // });

    //function(node) {
    //       const cond =  node.nodeName === 'SPAN' && node.querySelectorAll('span.block.mt-md').length > 0;
    //       console.log(node)
    //       console.log(node.querySelectorAll('span.block.mt-md'))
    //       return cond;
    //     }

    // turndownConverter.addRule('transformSpan', {
    //   filter: function(node) {
    //     return node.nodeName === 'DIV' && node.querySelectorAll('span.block.mt-md').length > 0;
    //   },
    //   replacement: function(content, node) {
    //     console.log(node)
    //     let newContent = content;
    //     console.log(newContent)
    //     const spanNodes = node.querySelectorAll('span.block.mt-md');
    //     console.log(spanNodes)
    //     spanNodes.forEach(spanNode => {
    //       newContent = newContent.replace(spanNode.outerHTML, '\n\n');
    //     });
    //     return newContent;
    //   }
    // });

    // const turndownService = new TurndownService({
    //   blankReplacement: function (content, node) {
    //     if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
    //       return '\n\n';
    //     } else {
    //       return '';
    //     }
    //   }
    // });



    // turndownConverter.addRule('transformSpan', {
    //   filter: 'span',
    //   replacement: function(content, node) {
    //     console.log(node)
    //     let newContent = content;
    //     const spanNodes = node.querySelectorAll('span.block.mt-md');
    //     console.log(spanNodes)
    //     spanNodes.forEach(spanNode => {
    //       newContent = newContent.replace(spanNode.outerHTML, '\n\n');
    //     });
    //     return newContent;
    //   }
    // });



    // turndownConverter.addRule('backslashAngleBracketsNotInBackticks', {
    //   filter: function (node) {
    //     return node.querySelector('div.break-words > div > div > span') !== null;
    //   },
    //   replacement: function (content, node) {
    //     let res = "";
    //     // Replace < and > characters in paragraphs but not in backticks
    //     node.querySelectorAll('div.break-words > div > div > *').forEach((elt) => {
    //       console.log(elt.nodeName)
    //       if (elt.nodeName === "SPAN") {
    //         res += "\n" + elt.textContent.replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n";
    //       }
    //       else
    //       {
    //         res += turndownConverter.turndown(elt.innerHTML);
    //       }
    //     });
    //     return res;
    //     // return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
    //   },
    // });
  }
}
