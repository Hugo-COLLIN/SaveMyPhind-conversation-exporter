import {extractMetadata} from "./extractMetadata";

export async function defineExtractor(domain) {
  let module, metadata;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`./types/ExtractorPhindSearch`);
      metadata = extractMetadata(require("./domains/PhindSearch.json"));
      break;
    case "PhindChat":
      module = await import(`./types/ExtractorPhindChat`);
      metadata = extractMetadata(require("./domains/PhindChat.json"));
      break;
    case "Perplexity":
      module = await import(`./types/ExtractorPerplexity`);
      metadata = extractMetadata(require("./domains/Perplexity.json"));
      break;
    case "MaxAIGoogle":
      module = await import(`./types/ExtractorMaxAIGoogle`);
      metadata = extractMetadata(require("./domains/MaxAI-Google.json"));
      break;
    default:
      module = await import(`./types/ExtractorArbitraryPage`);
      metadata = extractMetadata(require("./domains/ArbitraryPage.json"));
  }
  const moduleDefault = new module.default();
  return {default: moduleDefault, metadata, rules: module.turndown};
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
