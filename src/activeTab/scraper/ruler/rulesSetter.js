import {formatLink, turndownConverter} from "../../utils/format/formatMarkdown";

/**
 * Exported functions
 */
export default {
  setArbitraryPageRules,
  setPhindSearchRules,
  setPhindAgentRules,
  setPerplexityRules,
}


/**
 * Set format rules for Phind Search
 */
function setPhindSearchRules() {
  setPhindRules();
}

/**
 * Set format rules for Phind Agent
 */
function setPhindAgentRules() {
  setPhindRules();
}

/**
 * Turndown rules to correctly convert the Phind conversation content into markdown
 */
function setPhindRules() {
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

function setPerplexityRules() {
  turndownConverter.addRule('preserveLineBreaksInPre', {
    filter: function (node) {
      return node.nodeName === 'PRE' && node.querySelector('div');
    },
    replacement: function (content, node) {
      const codeBlock = node.querySelector('code');
      const codeContent = codeBlock.textContent.trim();
      const codeLang = codeBlock.parentNode.parentNode.parentNode.querySelector("div").textContent.trim();
      // const codeLang = codeBlock.className.split("-", 2)[1];
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

/**
 * Set format rules for arbitrary pages
 */
function setArbitraryPageRules() {
  let superfluousTags, superfluousClassIdOrAttribute;
  superfluousTags = ["header", "footer", "figure", "iframe", "nav", "aside", "style", "script", "link", "meta", "head", "svg", "img", "video", "audio", "canvas", "embed", "object", "param", "source", "track", "map", "area", "picture", "figcaption", "caption", "colgroup", "col", "tbody", "thead", "tfoot", "th", "form", "fieldset", "legend", "label", "input", "button", "select", "datalist", "optgroup", "option", "textarea", "output", "progress", "meter", "summary", "menuitem", "menu"];
  superfluousClassIdOrAttribute = ["sidebar", "nav", "dropdown", "button", "authentication", "navigation", "menu", "read-next", "hamburger", "logo"];

  superfluousTags.forEach((element) => {
    turndownConverter.addRule(`removeTag${element}`, {
      filter: element,
      replacement: function (content) {
        return '';
      },
    });
  });

  superfluousClassIdOrAttribute.forEach((element) => {
    //IDs
    turndownConverter.addRule(`removeId${element}`, {
      filter: function (node) {
        return node.getAttribute && node.getAttribute('id') && node.getAttribute('id').includes(element);
      },
      replacement: function (content) {
        return '';
      },
    });

    //Classes
    turndownConverter.addRule(`removeClass${element}`, {
      filter: function (node) {
        return node.getAttribute && node.getAttribute('class') && node.getAttribute('class').includes(element);
      },
      replacement: function (content) {
        return '';
      },
    });

    //Role attribute
    turndownConverter.addRule(`removeRole${element}`, {
      filter: function (node) {
        return node.getAttribute && node.getAttribute('role') && node.getAttribute('role').includes(element);
      },
      replacement: function (content) {
        return '';
      }
    });
  });

  turndownConverter.addRule('removeEmptyLinks', {
    filter: function (node) {
      return node.nodeName === 'A' && node.textContent.trim() === '';
    },
    replacement: function (content) {
      return '';
    },
  });

  turndownConverter.addRule('removeJsLinks', {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href') && node.getAttribute('href').startsWith('javascript:');
    },
    replacement: function (content) {
      return '';
    },
  });

  turndownConverter.addRule('reformatLinksContainingTags', {
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
  });

  turndownConverter.addRule('addHostnameToRelativeLinks', {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href') && node.getAttribute('href').startsWith('/') && node.innerHTML === node.textContent;
    },
    replacement: function (content, node) {
      return formatLink(window.location.protocol + "//" + window.location.host + node.getAttribute('href'), content);
    },
  });
}
