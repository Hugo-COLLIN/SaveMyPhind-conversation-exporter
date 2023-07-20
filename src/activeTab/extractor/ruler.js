
import {formatMarkdown, turndownConverter} from "./convert";
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

  // turndownConverter.addRule('specialCharsBackslashed', {
  //   filter: function(node) {
  //     return node.nodeType === Node.TEXT_NODE;
  //   },
  //   replacement: function(content) {
  //     // Replace < and > by {{@LT}} and {{@GT}}
  //     console.log(content);
  //     return content.replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
  //   }
  // });

  // don't keep formatting
  // turndownConverter.addRule('specialCharsBackslashed', {
  //   filter: function(node) {
  //     return !isExcludedTag(node.parentNode);
  //   },
  //   replacement: function(content, node) {
  //     // console.log(content)
  //     // return turndownConverter.turndown(content).replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
  //     let markdown = '';
  //     for (let i = 0; i < node.childNodes.length; i++) {
  //       let child = node.childNodes[i];
  //       console.log(child)
  //       if (child.nodeType === Node.ELEMENT_NODE) {
  //         markdown += turndownConverter.turndown(child.outerHTML);
  //       } else if (child.nodeType === Node.TEXT_NODE) {
  //         markdown += child.textContent.replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
  //       }
  //     }
  //     return markdown;
  //   }
  // });

  turndownConverter.addRule('specialCharsBackslashed', {
    filter: function(node) {
      return !isExcludedTag(node.parentNode);
    },
    replacement: function(content, node) {
      if(node.nodeType === 1){// 1 stands for Node.ELEMENT_NODE
        // content has already been processed by the built-in rules
        return content;
      } else if(node.nodeType === 3){ // 3 stands for Node.TEXT_NODE
        return content.replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
      }
    }
  });

  function isExcludedTag(node) {
    let excludedTags = ['code', 'pre', 'a'];
    return excludedTags.includes(node.tagName.toLowerCase());
  }

  turndownConverter.addRule('preserveFormatting', {
    filter: function(node) {
      return node.nodeType === 3; //Node.TEXT_NODE
    },
    replacement: function(content) {
      return content;
    }
  });



  // function replaceSpecialSymbols(input) {
  //   let output = "";
  //   let temp = "";
  //
  //   let insideTag = false;
  //
  //   for (let chr of input) {
  //     if (chr === '<') {
  //       insideTag = true;
  //       // Here we convert the previous accumulated text node, taking care not to disturb the tags.
  //       output += temp.replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
  //       temp = "<";
  //     }
  //     else if (chr === '>') {
  //       insideTag = false;
  //       // Add the complete tag to the output
  //       temp += ">";
  //       output += temp;
  //       temp = "";
  //     }
  //     else {
  //       temp += chr;
  //     }
  //   }
  //
  //   // If there's any leftover text, add it to the output
  //   if (!insideTag) {
  //     output += temp.replace(/</g, '{{@LT}}').replace(/>/g, '{{@GT}}');
  //   }
  //
  //   return output;
  // }
  //
  // turndownConverter.addRule('replaceAngleBrackets', {
  //   filter: ['text'],
  //   replacement: function(content) {
  //     return replaceSpecialSymbols(content);
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
