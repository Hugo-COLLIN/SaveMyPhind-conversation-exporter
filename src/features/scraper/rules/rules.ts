import {turndownConverter} from "../../../core/services/format/formatMarkdown";

/*
  --- Format pre-function ---
 */
export function getBlankReplacement(content: any, node: HTMLElement) {
  // if (node.nodeName === 'SPAN' && node.getAttribute('class') === 'block mt-md') {
  if (node.nodeName === 'SPAN') {
    if (node.classList.contains('block') && node.classList.contains('mt-md')) return '\n\n';
    if (node.innerHTML === '') return '\n';
  } else {
    return '';
  }
}

export function getBlankReplacement_PerplexityPages(content: any, node: { nodeName: string; getAttribute: (arg0: string) => string | string[]; }) {
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

export function filter_formatTables(node: { nodeName: string; }) {
  return node.nodeName === 'TABLE';
}

export function replacement_formatTables(content: any, node: { querySelector: (arg0: string) => any; }) {
  let headers = '';
  let separator = '';
  let body = '';
  const thead = node.querySelector('thead');
  const tbody = node.querySelector('tbody');

  if (thead) {
    const headerRows = thead.querySelectorAll('tr');
    headerRows.forEach((row: { querySelectorAll: (arg0: string) => any; }) => {
      const cells = row.querySelectorAll('th');
      let headerLine = '|';
      let separatorLine = '|';
      cells.forEach((cell: { textContent: string; }) => {
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
    bodyRows.forEach((row: { querySelectorAll: (arg0: string) => any; }) => {
      const cells = row.querySelectorAll('td');
      let bodyLine = '|';
      cells.forEach((cell: { textContent: string; }) => {
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
export function filter_PreserveLineBreaksInPre(node: { nodeName: string; querySelector: (arg0: string) => any; }) {
  return node.nodeName === 'PRE' && node.querySelector('div');
}

export function filter_PreserveLineBreaksInPre_Perplexity(node: { nodeName: string; querySelector: (arg0: string) => any; }) {
  return node.nodeName === 'PRE' && node.querySelector('div');
}

export function filter_preserveLineBreaksInPre_Phind(node: HTMLElement) {
  return node.nodeName === 'DIV' && node.classList.contains('relative') && node.querySelector('pre');
}

export function filter_PreserveLineBreaksInPre_Claude(node: { nodeName: string; querySelector: (arg0: string) => any; }) {
  return node.nodeName === 'PRE' && node.querySelector('div');
}

export function replacement_PreserveLineBreaksInPre_Perplexity(content: any, node: { querySelector: (arg0: string) => any; }) {
  // console.log("replacement_PreserveLineBreaksInPre_Perplexity", node)
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock.textContent.trim();
  const codeLang = codeBlock.parentNode.parentNode.parentNode.querySelector("div").textContent.trim();
  return (turndownConverter.turndown("<br>") + '\n```' + codeLang + '\n' + codeContent + '\n```');
}

export function replacement_preserveLineBreaksInPre_Phind(content: any, node: { querySelector: (arg0: string) => any; }) {
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock.textContent.trim();
  const codeLang = codeBlock.className.split("-", 2)[1];
  return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}

export function replacement_preserveLineBreaksInPre_ChatGPT(content: any, node: { querySelector: (arg0: string) => { (): any; new(): any; textContent: string; }; }) {
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock.textContent.trim();
  const codeLang = node.querySelector("pre > div > div")?.textContent.trim() ?? '';
  return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}

export function replacement_preserveLineBreaksInPre_Claude(content: any, node: any) {
  const codeBlock = node.querySelector('code');
  const codeContent = codeBlock?.textContent?.trim();
  const codeLang = codeBlock?.className?.split("-")[1] ?? '';
  return ('\n```' + codeLang + '\n' + codeContent + '\n```');
}

//---
export function filter_PreserveLineBreaksInCode_Claude(node: {
  parentNode: any;
  nodeName: string; querySelector: (arg0: string) => any; }) {
  return node.nodeName === 'CODE' && node.parentNode.classList.contains('code-block__code') && !node.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('pre');
  // return node.nodeName === 'CODE' && node.parentNode.parentNode.parentNode.parentNode.nodeType !== "PRE";
}

export function replacement_preserveLineBreaksInCode_Claude(content: any, node: any) {
  const clonedNode = node.cloneNode(true);
  const topLevelSpans = Array.from(clonedNode.children);

  // @ts-ignore
  topLevelSpans.forEach((span: HTMLElement, index: number) => {
    const nestedSpans = Array.from(span.children);

    if (nestedSpans.length > 0) {
      const firstSpan = nestedSpans[0] as HTMLElement;
      const text = firstSpan.textContent || '';

      // Count spaces at the beginning of line
      const leadingSpaces = text.match(/^[\s\t]*/)?.[0].length || 0;

      // Converts spaces to tabs (4 spaces = 1 tab)
      if (leadingSpaces > 0) {
        const tabCount = Math.floor(leadingSpaces / 4);
        firstSpan.textContent = '\t'.repeat(tabCount) + text.trim();
      }
      // else if (firstSpan?.textContent === '') {
      //   firstSpan.textContent = '\t';
      // }
    }

    // Adds a line break after each span except the last
    if (index < topLevelSpans.length - 1) {
      const newLineSpan = document.createElement('span');
      newLineSpan.textContent = '\n';
      span.parentNode?.insertBefore(newLineSpan, span.nextSibling);
    }
  });

  const codeContent = clonedNode.textContent?.trim() || '';
  const codeLang = node?.className?.split("-")[1] || '';

  return `\n\`\`\`${codeLang}\n${codeContent}\n\`\`\``;
}


/*
 --- Format Links ---
 */

export function filter_formatCitationsInAnswer_Perplexity(node: { getAttribute: (arg0: string) => string; }) {
  return node.getAttribute('class') && node.getAttribute('class').split(" ").includes('citation');
}

export function replacement_formatCitationsInAnswer_Perplexity(content: any, node: { querySelector: (arg0: string) => { (): any; new(): any; getAttribute: { (arg0: string): any; new(): any; }; }; textContent: any; nodeName: string; getAttribute: (arg0: string) => any; }) {
  const citationText = node.querySelector("[data-number]")?.getAttribute('data-number') // Classic citations
    ?? node.textContent; // Citations with icon (video, file...)
  if (node.nodeName === 'A') {
    const href = node.getAttribute('href');
    return ' [' + citationText + '](' + href + ')';
  } else {
    return ' [' + citationText + ']';
  }
}

export function filter_removeLineBreaksAroundLinks(node: { nodeName: string; classList: { contains: (arg0: string) => any; }; }) {
  // Filtre pour sélectionner les divs qui contiennent des liens avec la classe spécifique
  return node.nodeName === 'DIV' && node.classList.contains('inline-flex');
}


export function replacement_removeLineBreaksAroundLinks(content: any, node: { querySelector: (arg0: string) => any; }) {
  // Removes line breaks before and after the link content
  const link = node.querySelector('a');
  if (link) {
    const linkText = link.textContent || '';
    const href = link.getAttribute('href');
    return '[' + linkText + '](' + href + ')';
  }
  return content;
}

export function filter_formatBeforeLinks(node: { nodeName: string; classList: { contains: (arg0: string) => any; }; }) {
  // return node.nodeName === 'SPAN' && node.classList.contains('whitespace-nowrap')
  return node.nodeName === 'SPAN' && node.classList.contains('whitespace-normal')
    // || node.nodeName === 'SPAN' && node.classList.contains('whitespace-nowrap')
}

export function replacement_formatBeforeLinks(content: string, node: any) {
  // console.log("replacement_formatBeforeLinks", node);
  // console.log(content.trim())
  return content.trim();
}

/*
  --- Format KateX ---
 */

export function filter_formatKatex(node: { nodeName: string; classList: { contains: (arg0: string) => any; }; }) {
  return node.nodeName === 'SPAN' && node.classList.contains('katex');
}

export function replacement_formatKatex(content: any, node: { querySelector: (arg0: string) => { (): any; new(): any; textContent: string; }; textContent: string; parentNode: { classList: { contains: (arg0: string) => any; }; }; }) {
  // Cannot just select "math annotation" as it's missing in the node children (but rendered in the node.textContent !?!?)
  const mrow = node.querySelector("math mrow")?.textContent ?? "";
  const htmlMath = node.querySelector(".katex-html")?.textContent ?? "";

  // Remove mrow at start and htmlMath at end of node.textContent
  const mathml = node.textContent
    ?.replace(mrow, "")
    .replace(htmlMath, "")
    .trim()
    ?? node.textContent;

  if (node.parentNode?.classList.contains('katex-display')) {
    return '\n$$' + mathml + '$$\n';
  }
  return '$' + mathml + '$';
}

/*
  --- Claude rules ---
 */
export function filter_captureArtifactContent_Claude(node: Element) {
  //target button[aria-label="Preview contents"] :
  return node.nodeName === 'BUTTON' && node.getAttribute('aria-label') === 'Preview contents';
}

export function replacement_captureArtifactContent_Claude(content: any, node: Element) {
  return `{{@CAPTURE_ARTIFACT_CONTENT:${node.querySelector(".break-words")?.textContent}}}`;
}



/*
  --- Phind rules ---
 */

export function filter_formatLinks_Phind(node: { nodeName: string; }) {
    return node.nodeName === 'A';
}

export function replacement_formatLinks_Phind(content: string, node: HTMLElement) {
    const href = node.getAttribute('href');
    const linkText = node.querySelector('span')?.textContent || node.textContent;
    // const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '');
    return ' [' + linkText + '](' + href + ')';
}

// export function filter_backslashAngleBracketsNotInBackticks_Phind(node: { querySelectorAll: (arg0: string) => { (): any; new(): any; length: number; }; }) {
//     return node.querySelectorAll('p').length > 0;
// }
//
// export function replacement_backslashAngleBracketsNotInBackticks_Phind(content: any, node: { innerHTML: any; }) {
//     // Replace < and > characters in paragraphs but not in backticks
//     return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
// }

/*
  --- Arbitrary page rules ---
 */
export const rules = {
  'reformatLinksContainingTags': {
    filter: function (node: { nodeName: string; getAttribute: (arg0: string) => any; innerHTML: any; textContent: any; }) {
      return node.nodeName === 'A' && node.getAttribute('href') && node.innerHTML !== node.textContent;
    },
    replacement: function (content: any, node: { childNodes: string | any[]; }) {
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
