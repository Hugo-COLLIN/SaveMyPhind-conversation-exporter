import converter from "../../../shared/formatter/formatMarkdown";
import {formatFilename} from "../../../shared/formatter/formatText";

export class Extractor {
  async launch() {
    this.applyExtractorRules();
    const markdownContent = await this.extractPage(converter[`formatMarkdown`]); //await dynamicCall(extractPages, `extract${domain.name}Page`, converter[`formatMarkdownAll`]);
    const metadata = this.extractMetadata(); //await dynamicCall(extractMetadata, `extract${domain.name}Metadata`);
    const fileName = formatFilename(metadata.title, metadata.source);
    return {markdownContent, title: metadata.title, fileName};
  }

  /**
   * Catch page interesting elements to convert the content into markdown
   * @returns {Promise<string>} markdown
   */
  async extractPage(format) {
    throw new Error("Not implemented");
  }

  extractMetadata() {
    return {
      title: this.getPageTitle(),
      source: this.getPageSource()
    }
  }

  /**
   * Get the title of the page
   * @returns {string} title
   */
  getPageTitle() {
    throw new Error("Not implemented");
  }

  /**
   * Get the source of the page
   * @returns {string} source
   */
  getPageSource() {
    throw new Error("Not implemented");
  }

  /**
   * Turndown rules to correctly convert the Phind conversation content into markdown
   */
  applyExtractorRules() {
    throw new Error("Not implemented");
  }
}
