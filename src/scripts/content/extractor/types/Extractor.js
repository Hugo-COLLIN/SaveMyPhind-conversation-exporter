import converter from "../../../shared/formatter/formatMarkdown";

export class Extractor {
  async launch() {
    this.applyExtractorRules();
    return await this.extractPage(converter[`formatMarkdown`]);
  }

  /**
   * Catch page interesting elements to convert the content into markdown
   * @returns {Promise<string>} markdown
   */
  async extractPage(format) {
    throw new Error("Not implemented");
  }

  /**
   * Turndown rules to correctly convert the Phind conversation content into markdown
   */
  applyExtractorRules() {
    throw new Error("Not implemented");
  }
}
