import converter from "../formatter/formatMarkdown.all";
import {formatFilename} from "../formatter/formatText.all";
import appInfos from "../../../../infos.json";

export class Extractor {
  async launch() {
    try {
      this.applyExtractorRules();
      const markdownContent = await this.extractPage(converter[`formatMarkdown`]) //await dynamicCall(extractPages, `extract${domain.name}Page`, converter[`formatMarkdownAll`]);
      const metadata = this.extractMetadata() //await dynamicCall(extractMetadata, `extract${domain.name}Metadata`);
      const fileName = formatFilename(metadata.title, metadata.source);
      return {markdownContent, title: metadata.title, fileName};
    }
    catch (e) {
      console.error(e);
      alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
      return null;
    }
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
   * Turndown rulesTab to correctly convert the Phind conversation content into markdown
   */
  applyExtractorRules() {
    throw new Error("Not implemented");
  }
}
