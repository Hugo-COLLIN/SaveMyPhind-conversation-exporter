import {extractMetadata} from "./extractMetadata";
import {applyExtractorRules, generateRules} from "./rules/applyRules";
import {extractPageCommon} from "./extractPage";
import {safeExecute} from "../../shared/utils/jsShorteners";
import converter from "../../shared/formatter/formatMarkdown";
import {EXTRACTOR_FALLBACK_ACTION} from "../scraper/fallbackActions";
import {formatFilename} from "../../shared/formatter/formatText";

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
      json = require("./domains/ArbitraryPage.json");
  }
  metadata = metadata ?? extractMetadata(json);
  const rules = (json?.turndown && generateRules(json?.turndown)) ?? module.turndown;

  applyExtractorRules(rules);

  return {
    title: metadata.pageTitle,
    fileName: formatFilename(metadata.pageTitle, metadata.domainName),
    markdownContent: await safeExecute(module.extractPage
      ? module.extractPage(converter[`formatMarkdown`], metadata)
      : extractPageCommon(converter[`formatMarkdown`], metadata, module.processMessage)
      , EXTRACTOR_FALLBACK_ACTION()),
  };

  // const launch =

  // const launch = !moduleDefault.extractPage
  //   ? async () => await extractPageCommon()
  //   : async () => await moduleDefault.extractPage(metadata.format, metadata);
  // const launch = async () => await moduleDefault.extractPage(metadata.format, metadata);
  // return {extractPage, metadata, rules};
  // let extractor = await import(`./ExtractorTab${domain.name}`);
}
