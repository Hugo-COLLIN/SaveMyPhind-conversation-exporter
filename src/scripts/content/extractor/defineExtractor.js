import {extractMetadata} from "./extractMetadata";
import {generateRules} from "./rules/applyRules";
import {extractPageCommon} from "./extractPage";

export async function defineExtractor(domain) {
  let json, module, metadata;
  switch (domain.name) {
    case "PhindSearch":
      module = await import(`./types/ExtractorPhindSearch`);
      json = require("./domains/PhindSearch.json");
      break;
    case "PhindChat":
      module = await import(`./types/ExtractorPhindChat`);
      json = require("./domains/PhindChat.json");
      break;
    case "Perplexity":
      module = await import(`./types/ExtractorPerplexity`);
      json = require("./domains/Perplexity.json");
      break;
    case "MaxAIGoogle":
      module = await import(`./types/ExtractorMaxAIGoogle`);
      json = require("./domains/MaxAI-Google.json");
      break;
    default:
      module = await import(`./types/ExtractorArbitraryPage`);
      metadata = extractMetadata(require("./domains/ArbitraryPage.json"));
  }
  const moduleDefault = new module.default();
  metadata = metadata ?? extractMetadata(json);
  const rules = (json?.turndown && generateRules(json?.turndown)) ?? module.turndown;

  // const launch =

  // const launch = !moduleDefault.extractPage
  //   ? async () => await extractPageCommon()
  //   : async () => await moduleDefault.extractPage(metadata.format, metadata);
  // const launch = async () => await moduleDefault.extractPage(metadata.format, metadata);
  return {extractPage: module.extractPage, metadata, rules};
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
