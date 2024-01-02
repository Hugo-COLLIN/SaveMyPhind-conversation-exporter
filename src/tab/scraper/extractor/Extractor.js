import {dynamicCall} from "../../../common/utils";
import {getAppInfos} from "../../../common/appInfos";

export class Extractor {
  constructor(domain) {
    this.domain = domain;
  }

  async extract() {
    try {
      const markdownContent = await this.extractPages();
      const metadata = this.extractMetadata();
      const fileName = this.formatFilename(metadata.title, metadata.source); //???
      return {markdownContent, title: metadata.title, fileName};
    }
    catch (e) {
      console.error(e);
      const appInfos = await getAppInfos();
      alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
      return null;
    }
  }

  async extractPages() {
    return dynamicCall(this.extractPages, `extract${this.domain.name}Page`, converter[`formatMarkdown`]);
  }

  extractMetadata() {
    return dynamicCall(this.extractMetadata, `extract${this.domain.name}Metadata`);
  }

  formatFilename(title, source) {
    return this.formatFilename(title, source);
  }
}
