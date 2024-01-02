import {Extractor} from "./Extractor";

export class ChatbotExtractor extends Extractor {
  constructor(domain) {
    super(domain);
  }

  extractSources() {
    throw new Error("Not implemented");
  }
}
