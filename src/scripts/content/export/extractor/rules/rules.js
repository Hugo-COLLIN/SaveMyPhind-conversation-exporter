import {turndownConverter} from "../../../../shared/formatter/formatMarkdown";

/*
  --- Format pre-function ---
 */
export function getBlankReplacement(content, node) {
  if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
    return '\n\n';
  } else {
    return '';
  }
}

export function getBlankReplacement_PerplexityPages(content, node) {
  // console.log(node.nodeName === 'SPAN' && node.getAttribute('class') === 'mt-md block', node.nodeName, node.getAttribute('class'), node);
  if (node.nodeName === 'SPAN' && node.getAttribute('class')?.includes('block')) {
    return '\n\n';
  } else {
    return '';
  }
}

/*
 --- Format tables ---
 */

export function filter_formatTables(node) {
  return node.nodeName === 'TABLE';
}

export function replacement_formatTables(content, node) {
  let headers = '';
  let separator = '';
  let body = '';
  const thead = node.querySelector('thead');
  const tbody = node.querySelector('tbody');

  if (thead) {
    const headerRows = thead.querySelectorAll('tr');
    headerRows.forEach(row => {
      const cells = row.querySelectorAll('th');
      let headerLine = '|';
      let separatorLine = '|';
      cells.forEach(cell => {
        const cellContent = cell.textContent.trim();
        headerLine += ` ${cellContent} |`;
        separatorLine += ' --- |';
      });
      headers += headerLine + '\n';
      separator += separatorLine + '\n';
    });
  }

  if (tbody) {
    const bodyRows = tbody.querySelectorAll('tr');
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      let bodyLine = '|';
      cells.forEach(cell => {
        const cellContent = cell.textContent.trim();
        bodyLine += ` ${cellContent} |`;
      });
      body += bodyLine + '\n';
    });
  }

  return headers + separator + body;
}

/*
  --- Format code blocks ---
 */
export function filter_PreserveLineBreaksInPre(node) {
  return node.nodeName === 'PRE' && node.querySelector('div');
}

export function filter_PreserveLineBreaksInPre_Perplexity(node) {
  return node.nodeName === 'PRE' && node.querySelector('div');
}

export function filter_preserveLineBreaksInPre_Phind(node) {
  return node.nodeName === 'PRE' && node.querySelector('div');
}

export function replacement_PreserveLineBreaksInPre_Perplexity(content, node) {
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock.textContent.trim();
  const codeLang = codeBlock.parentNode.parentNode.parentNode.querySelector("div").textContent.trim();
  return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}

export function replacement_preserveLineBreaksInPre_Phind(content, node) {
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock.textContent.trim();
  const codeLang = codeBlock.className.split("-", 2)[1];
  return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}

export function replacement_preserveLineBreaksInPre_ChatGPT(content, node) {
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock.textContent.trim();
  const codeLang = node.querySelector("pre > div > div")?.textContent.trim() ?? '';
  return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}



/*
 --- Format Links ---
 */

export function filter_formatCitationsInAnswer_Perplexity(node) {
  return node.getAttribute('class') && node.getAttribute('class').split(" ").includes('citation');
}

export function replacement_formatCitationsInAnswer_Perplexity(content, node) {
  const citationText = node.querySelector("[data-number]")?.getAttribute('data-number') // Classic citations
    ?? node.textContent; // Citations with icon (video, file...)
  if (node.nodeName === 'A') {
    const href = node.getAttribute('href');
    return ' [' + citationText + '](' + href + ')';
  } else {
    return ' [' + citationText + ']';
  }
}

export function filter_removeLineBreaksAroundLinks(node) {
  // Filtre pour sélectionner les divs qui contiennent des liens avec la classe spécifique
  return node.nodeName === 'DIV' && node.classList.contains('inline-flex');
}


export function replacement_removeLineBreaksAroundLinks(content, node) {
  // Removes line breaks before and after the link content
  const link = node.querySelector('a');
  if (link) {
    const linkText = link.textContent || '';
    const href = link.getAttribute('href');
    return '[' + linkText + '](' + href + ')';
  }
  return content;
}

export function filter_formatBeforeLinks(node) {
  // return node.nodeName === 'SPAN' && node.classList.contains('whitespace-nowrap')
  return node.nodeName === 'SPAN' && node.classList.contains('whitespace-normal')
    // || node.nodeName === 'SPAN' && node.classList.contains('whitespace-nowrap')
}

export function replacement_formatBeforeLinks(content, node) {
  // console.log("replacement_formatBeforeLinks", node);
  // console.log(content.trim())
  return content.trim();
}

/*
  --- Phind rules ---
 */

export function filter_formatLinks_Phind(node) {
    return node.nodeName === 'A';
}

export function replacement_formatLinks_Phind(content, node) {
    const href = node.getAttribute('href');
    const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '');
    return '[' + linkText + '](' + href + ')';
}

export function filter_backslashAngleBracketsNotInBackticks_Phind(node) {
    return node.querySelectorAll('p').length > 0;
}

export function replacement_backslashAngleBracketsNotInBackticks_Phind(content, node) {
    // Replace < and > characters in paragraphs but not in backticks
    return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
}

/*
  --- Arbitrary page rules ---
 */
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
