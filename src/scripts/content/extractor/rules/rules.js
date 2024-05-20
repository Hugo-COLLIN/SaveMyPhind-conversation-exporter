import {turndownConverter} from "../../../shared/formatter/formatMarkdown";

export const rules = {
  'reformatLinksContainingTags': {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href') && node.innerHTML !== node.textContent;
    },
    replacement: function (content, node) {
      let markdown = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        let child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          markdown += turndownConverter.turndown(child.outerHTML); //"<blockquote>" + child.outerHTML + "</blockquote>";
        } else if (child.nodeType === Node.TEXT_NODE) {
          markdown += child.textContent;
        }
      }
      // markdown += "\n" + formatUrl(
      //   node.getAttribute('href').startsWith("/") ?
      //       window.location.protocol + "//" + window.location.host + node.getAttribute('href') :
      //       node.getAttribute('href'),
      //   "Open link ⨠") + "\n";
      return markdown;
    },
  }
}

/*
 --- Perplexity rules ---
 */

export function getBlankReplacement(content, node) {
    if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
      return '\n\n';
    } else {
      return '';
    }
}

export function filter_PreserveLineBreaksInPre_Perplexity(node) {
    return node.nodeName === 'PRE' && node.querySelector('div');
}

export function replacement_PreserveLineBreaksInPre_Perplexity(content, node) {
    const codeBlock = node.querySelector('code');
    const codeContent = codeBlock.textContent.trim();
    const codeLang = codeBlock.parentNode.parentNode.parentNode.querySelector("div").textContent.trim();
    return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}

export function filter_formatCitationsInAnswer_Perplexity(node) {
    return node.getAttribute('class') && node.getAttribute('class').split(" ").includes('citation');
}

export function replacement_formatCitationsInAnswer_Perplexity(content, node) {
    const citationText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '').replace(/\n/g, '');
    console.log("passed citationText: " + citationText);
    if (node.nodeName === 'A') {
      const href = node.getAttribute('href');
      return ' [' + citationText + '](' + href + ')';
    } else {
      return ' [' + citationText + ']';
    }
}

/*
  --- Phind rules ---
 */

export function filter_preserveLineBreaksInPre_Phind() {
  return function (node) {
    return node.nodeName === 'PRE' && node.querySelector('div');
  };
}

export function replacement_preserveLineBreaksInPre_Phind() {
  return function (content, node) {
    const codeBlock = node.querySelector('code');
    const codeContent = codeBlock.textContent.trim();
    const codeLang = codeBlock.className.split("-", 2)[1];
    return ('\n```' + codeLang + '\n' + codeContent + '\n```');
  };
}

export function filter_formatLinks_Phind() {
  return function (node) {
    return node.nodeName === 'A';
  };
}

export function replacement_formatLinks_Phind() {
  return function (content, node) {
    const href = node.getAttribute('href');
    const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '');
    return '[' + linkText + '](' + href + ')';
  };
}

export function filter_backslashAngleBracketsNotInBackticks_Phind() {
  return function (node) {
    return node.querySelectorAll('p').length > 0;
  };
}

export function replacement_backslashAngleBracketsNotInBackticks_Phind() {
  return function (content, node) {
    // Replace < and > characters in paragraphs but not in backticks
    return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
  };
}
