import {extractPageMetadata} from "./extractPageMetadata";
import {applyExtractorRules, generateRules} from "./rules/applyRules";
import {extractPageContent} from "./extractPageContent";
import {safeExecute} from "../../shared/utils/jsShorteners";
import converter from "../../shared/formatter/formatMarkdown";
import {EXTRACTOR_FALLBACK_ACTION} from "../scraper/fallbackActions";
import {formatFilename} from "../../shared/formatter/formatText";

export async function extractPage(domain) {
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
  metadata = metadata ?? extractPageMetadata(json);
  const rules = (json?.turndown && generateRules(json?.turndown)) ?? module.turndown;

  applyExtractorRules(rules);

  return {
    title: metadata.pageTitle,
    fileName: formatFilename(metadata.pageTitle, metadata.domainName),
    markdownContent: await safeExecute(module.extractPage
      ? module.extractPageContent(converter[`formatMarkdown`], metadata)
      : extractPageContent(converter[`formatMarkdown`], metadata, module.processMessage)
      , EXTRACTOR_FALLBACK_ACTION()),
  };
}
