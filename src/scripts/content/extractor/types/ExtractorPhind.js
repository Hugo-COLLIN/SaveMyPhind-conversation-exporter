import {Extractor} from "./Extractor";
import {initTurndown, turndownConverter} from "../../../shared/formatter/formatMarkdown";

export const turndown = {
  init: {
    blankReplacement: function(content, node) {
      if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
        return '\n\n';
      } else {
        return '';
      }
    }
  },
  rules: {
    preserveLineBreaksInPre: {
      filter: function (node) {
        return node.nodeName === 'PRE' && node.querySelector('div');
      },
      replacement: function (content, node) {
        const codeBlock = node.querySelector('code');
        const codeContent = codeBlock.textContent.trim();
        const codeLang = codeBlock.className.split("-", 2)[1];
        return ('\n```' + codeLang + '\n' + codeContent + '\n```');
      }
    },
    formatLinks: {
      filter: 'a',
      replacement: function (content, node) {
        const href = node.getAttribute('href');
        const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '');
        return '[' + linkText + '](' + href + ')';
      }
    },
    backslashAngleBracketsNotInBackticks: {
      filter: function (node) {
        return node.querySelectorAll('p').length > 0;
      },
      replacement: function (content, node) {
        // Replace < and > characters in paragraphs but not in backticks
        return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
      },
    }
  }
}

export default class ExtractorPhind extends Extractor {
  // applyExtractorRules() {
  //   initTurndown();
  //   turndownConverter.addRule('preserveLineBreaksInPre', turndown.rules.preserveLineBreaksInPre);
  //   turndownConverter.addRule('formatLinks', turndown.rules.formatLinks);
  //   turndownConverter.addRule('backslashAngleBracketsNotInBackticks', turndown.rules.backslashAngleBracketsNotInBackticks);
  // }
}
