import {extractMetadata} from "./extractMetadata";
import {generateRules} from "./rules/applyRules";

export async function defineExtractor(domain) {
  let json, module, metadata, rules;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`./types/ExtractorPhindSearch`);
      json = require("./domains/PhindSearch.json");
      metadata = extractMetadata(json);
      break;
    case "PhindChat":
      module = await import(`./types/ExtractorPhindChat`);
      metadata = extractMetadata(require("./domains/PhindChat.json"));
      break;
    case "Perplexity":
      module = await import(`./types/ExtractorPerplexity`);
      json = require("./domains/Perplexity.json");
      metadata = extractMetadata(json);
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
  return {default: moduleDefault, metadata, rules: generateRules(json.turndown) ?? module.turndown};
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
