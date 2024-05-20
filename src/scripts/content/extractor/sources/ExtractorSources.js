import {Extractor} from "../types/Extractor";

export default class ExtractorSources extends Extractor {
  async extractSources(content, format) {
    throw new Error("Not implemented");
  }
}
