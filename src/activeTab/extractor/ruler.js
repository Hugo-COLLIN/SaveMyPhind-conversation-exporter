
import {turndownConverter} from "./convert";
import {formatUrl} from "../utils/utils";

export function setRandomPageRules() {
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
      return formatUrl(window.location.protocol + "//" + window.location.host + node.getAttribute('href'), content);
    },
  });
}

/**
 * Turndown rules to correctly convert the Phind conversation content into markdown
 */
export function setPhindRules() {
  // turndownConverter.addRule('specialCharsBackslashedIfNotLink', {
  //   filter: function(node) {
  //     // Check if the node is a text node and a child of an anchor tag
  //     return node.nodeName !== 'A';
  //   },
  //   replacement: function(content, node) {
  //     // console.log(node);
  //     // Replace '<' and '>' with their HTML entity equivalents
  //     const c = content.replace(/</g, `{{@LT}}`).replace(/>/g, `{{@GT}}`);
  //     console.log(c)
  //     return c;
  //   }
  // });

  // turndownConverter.addRule('specialCharsBackslashed', {
  //   filter: function(node) {
  //     // Apply this rule to all elements
  //     return true;
  //   },
  //   replacement: function(content) {
  //     // Only modify the content if it's not part of a link
  //     if (!/<a[^>]*>.*?<\/a>/i.test(content)) {
  //       content = content.replace(/</g, `{{@LT}}`).replace(/>/g, `{{@GT}}`);
  //     }
  //     return content;
  //   }
  // });
  //
  //
  //
  // turndownConverter.addRule('unorderedList', {
  //     filter: 'ul',
  //     replacement: function (content) {
  //       return '\n' + content + '\n';
  //     }
  //   });
  //
  // turndownConverter.addRule('listItem', {
  //     filter: 'li',
  //     replacement: function (content) {
  //       return '* ' + content + '\n';
  //     }
  //   });

  // turndownConverter.addRule('specialCharsBackslashed', {
  //   filter: function(node) {
  //     // Apply this rule to all node types except for Links
  //     return node.nodeName !== 'A';
  //   },
  //   replacement: function(content, node) {
  //     // Parse the content as HTML
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(content, 'text/html');
  //
  //     // Create a TreeWalker to iterate over text nodes
  //     const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  //     var textNode;
  //
  //     while (textNode = walker.nextNode()) {
  //       // Replace '<' and '>' with their HTML entity equivalents
  //       textNode.nodeValue = textNode.nodeValue.replace(/</g, `{{@LT}}`).replace(/>/g, `{{@GT}}`);
  //     }
  //
  //     // Serialize the modified HTML back to a string
  //     content = new XMLSerializer().serializeToString(doc.body);
  //     // Remove the added <body> and </body> tags
  //     content = content.replace(/^<body>|<\/body>$/g, '');
  //     return content;
  //   }
  // });


  // turndownConverter.addRule('specialCharsBackslashed', {
  //   filter: function(node, options) {
  //     // Apply this rule to all text nodes except for those which are descendants of 'A' nodes
  //     if(node.nodeType === 3) {
  //       let parent = node.parentNode;
  //       while(parent) {
  //         if(parent.nodeName === 'A') {
  //           return false;
  //         }
  //         parent = parent.parentNode;
  //       }
  //       return true;
  //     }
  //     else {
  //       return false;
  //     }
  //   },
  //   replacement: function(content, node, options) {
  //     return content.replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
  //   }
  // });

  //Not working
  // turndownConverter.addRule('escapedSpecialChars', {
  //   filter: function (node) {
  //     return node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A';
  //   },
  //
  //   replacement: (content, node, options) => {
  //
  //     function escapeHtml(html) {
  //       return html
  //         .replace(/</g, '&lt;')
  //         .replace(/>/g, '&gt;');
  //     }
  //
  //     // Depending on the type of node, we'll do different types of processing.
  //     if (node.nodeType === Node.ELEMENT_NODE) {
  //       return Array.from(node.childNodes).map(childNode => {
  //         // The reference to this.options.rules is changed to options.rules
  //         return options.rules.replacement(content, childNode, options)
  //       }).join('');
  //     } else if (node.nodeType === Node.TEXT_NODE) {
  //       return escapeHtml(node.data);
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
      const codeLang = codeBlock.className.split("-", 2)[1];
      return ('\n```' + codeLang + '\n' + codeContent + '\n```');
    }
  });

  turndownConverter.addRule('replaceEscapedBracketsInLinks', {
    filter: 'a',
    replacement: function (content, node) {
      const href = node.getAttribute('href');
      const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')');
      return '[' + linkText + '](' + href + ')';
    }
  });
}
