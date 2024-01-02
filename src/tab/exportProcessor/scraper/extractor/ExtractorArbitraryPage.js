import {Extractor} from "./Extractor";
import {setFileHeader} from "../../formatter/formatMarkdown";

export default class ExtractorArbitraryPage extends Extractor {
  constructor(domain) {
    super(domain);
  }

  async extractPage(format) {
    let markdown = await setFileHeader(document.title, window.location.hostname)
    const html = document.querySelector("body").innerHTML;
    markdown += format(html);
    return markdown;
  }

  getPageTitle() {
    return document.title ?? "";
  }

  getPageSource() {
    return window.location.hostname;
  }
}
