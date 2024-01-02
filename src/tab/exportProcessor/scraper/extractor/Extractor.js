export class Extractor {
  constructor(domain) {
    this.domain = domain;
  }

  extractMetadata() {
    return {
      title: this.getPageTitle(),
      source: this.getPageSource()
    }
  }

  /**
   * Catch page interesting elements to convert the content into markdown
   * @returns {Promise<string>} markdown
   */
  async extractPage(format) {
    throw new Error("Not implemented");
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
}
