import converter from "../../../shared/formatter/formatMarkdown";

export class Extractor {
  async launch() {
    return await this.extractPage(converter[`formatMarkdown`]);
  }

  /**
   * Catch page interesting elements to convert the content into markdown
   * @returns {Promise<string>} markdown
   */
  async extractPage(format) {
    throw new Error("Not implemented");
  }
}
