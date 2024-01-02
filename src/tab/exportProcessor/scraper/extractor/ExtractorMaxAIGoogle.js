import {Extractor} from "./Extractor";
import {formatLink, initTurndown, setFileHeader} from "../../formatter/formatMarkdown";

export default class ExtractorMaxAIGoogle extends Extractor {
  constructor(domain) {
    super(domain);
  }

  /**
   * TODO: Chatbot name before answer + get title from MaxAI query, not from google textarea (differences)
   */
  async extractPage(format) {
    const hostElement = document.querySelector('[id^=MAXAI]');
    if (hostElement === null) return null;
    const shadowRoot = hostElement.shadowRoot;

    const selectAnswer = shadowRoot.querySelector('.search-with-ai--text');
    if (selectAnswer === null) return null;

    let selectSources = shadowRoot.querySelector('[class*=--MuiGrid-container]');
    if (selectSources) selectSources = selectSources.childNodes

    let markdown = await setFileHeader(this.getPageTitle(), "MaxAI in Google");
    markdown += "## Answer\n" + format(selectAnswer.innerHTML) + "\n\n";
    markdown += "---\n**Sources:**\n";
    let i = 1;
    selectSources.forEach((elt) => {
      const text = elt.querySelector("a p")
      const url = elt.querySelector("a").href;
      if (text !== null) markdown += "- " + formatLink(url, i + ". " + text.innerHTML) + "\n";
      i ++;
    });
    markdown += "\n\n";

    return markdown;
  }

  getPageTitle() {
    return document.querySelector("textarea").innerHTML ?? "";
  }

  getPageSource() {
    return "MaxAI-Google";
  }

  applyExtractorRules() {
    initTurndown();

    // turndownConverter.addRule('reformatLinksContainingTags', {
    //   filter: function (node) {
    //     return node.nodeName === 'A' && node.getAttribute('href') && node.innerHTML !== node.textContent;
    //   },
    //   replacement: function (content, node) {
    //     let markdown = '';
    //     for (let i = 0; i < node.childNodes.length; i++) {
    //       let child = node.childNodes[i];
    //       if (child.nodeType === Node.ELEMENT_NODE) {
    //         markdown += turndownConverter.turndown(child.outerHTML); //"<blockquote>" + child.outerHTML + "</blockquote>";
    //       } else if (child.nodeType === Node.TEXT_NODE) {
    //         markdown += child.textContent;
    //       }
    //     }
    //     // markdown += "\n" + formatUrl(
    //     //   node.getAttribute('href').startsWith("/") ?
    //     //       window.location.protocol + "//" + window.location.host + node.getAttribute('href') :
    //     //       node.getAttribute('href'),
    //     //   "Open link ⨠") + "\n";
    //     return markdown;
    //   },
    // });
    //
    // turndownConverter.addRule('formatLinks', {
    //   filter: 'a',
    //   replacement: function (content, node) {
    //     const href = node.getAttribute('href');
    //     const linkText = content.replace(/\\\[/g, '(').replace(/\\\]/g, ')').replace(/</g, '').replace(/>/g, '');
    //     return '[' + linkText + '](' + href + ')';
    //   }
    // });
    //
    // turndownConverter.addRule('backslashAngleBracketsNotInBackticks', {
    //   filter: function (node) {
    //     return node.querySelectorAll('p').length > 0;
    //   },
    //   replacement: function (content, node) {
    //     // Replace < and > characters in paragraphs but not in backticks
    //     return "\n" + turndownConverter.turndown(node.innerHTML).replace(/(?<!`)<(?!`)/g, '{{@LT}}').replace(/(?<!`)>(?!`)/g, '{{@GT}}') + "\n\n";
    //   },
    // });
  }
}
