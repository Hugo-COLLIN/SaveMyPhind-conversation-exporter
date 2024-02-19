import {Extractor} from "./Extractor";
import {initTurndown, turndownConverter} from "../formatter/formatMarkdown";

export default class ExtractorPhind extends Extractor {
  getPageTitle() {
    const searchFirstMsg = document.querySelector('[name^="answer-"] span');
    const agentFirstMsg = document.querySelector('[tabindex="0"]');
    return searchFirstMsg !== null && searchFirstMsg.innerHTML !== ""
      ? searchFirstMsg.innerHTML
      : agentFirstMsg
        ? agentFirstMsg.innerText.replace(/\u00A0/g, " ")
        : "";
  }

  applyExtractorRules() {
    initTurndown();
    turndownConverter.addRule('preserveLineBreaksInPre', {
      filter: function (node) {
        return node.nodeName === 'PRE' && node.querySelector('div');
      },
      replacement: function (content, node) {
        const codeBlock = node.querySelector('code');
        const codeContent = codeBlock.textContent.trim();
        const codeLang = codeBlock.className.split("-", 2)[1];
        return ('\n```' + codeLang + '\n' + codeContent + '\n```');
      }
    });

    turndownConverter.addRule('formatLinks', {
      filter: 'a',
      replacement: function (content, node) {
        const href = node.getAttribute('href');
        const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '');
        return '[' + linkText + '](' + href + ')';
      }
    });

    turndownConverter.addRule('backslashAngleBracketsNotInBackticks', {
      filter: function (node) {
        return node.querySelectorAll('p').length > 0;
      },
      replacement: function (content, node) {
        // Replace < and > characters in paragraphs but not in backticks
        return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
      },
    });
  }
}
