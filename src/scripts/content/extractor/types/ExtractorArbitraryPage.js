import {Extractor} from "./Extractor";
import {formatLink, setFileHeader, turndownConverter} from "../../../shared/formatter/formatMarkdown";
import {rules} from "../rules";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import {getPageTitle} from "../extractMetadata";

export const metadata = {
  pageTitle: getPageTitle(),
  domainName: window.location.hostname
};

export default class ExtractorArbitraryPage extends Extractor {
  async extractPage(format) {
    let markdown = await safeExecute(setFileHeader(getPageTitle(), window.location.hostname));
    const html = document.querySelector("body").innerHTML;
    markdown += format(html);
    return markdown;
  }

  applyExtractorRules() {
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

    turndownConverter.addRule('reformatLinksContainingTags', rules.reformatLinksContainingTags);

    turndownConverter.addRule('addHostnameToRelativeLinks', {
      filter: function (node) {
        return node.nodeName === 'A' && node.getAttribute('href') && node.getAttribute('href').startsWith('/') && node.innerHTML === node.textContent;
      },
      replacement: function (content, node) {
        return formatLink(window.location.protocol + "//" + window.location.host + node.getAttribute('href'), content);
      },
    });
  }
}
