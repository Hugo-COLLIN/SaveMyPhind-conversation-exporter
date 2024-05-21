import converter from "../../../shared/formatter/formatMarkdown";

export class Extractor {
  async launch(metadata) {
    return await this.extractPage(converter[`formatMarkdown`], metadata);
  }

  /**
   * Catch page interesting elements to convert the content into markdown
   * @returns {Promise<string>} markdown
   */
  async extractPage(format, metadata) {
    // throw new Error("Not implemented");
  }
}
