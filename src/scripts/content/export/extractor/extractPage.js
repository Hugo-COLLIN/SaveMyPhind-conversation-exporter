import {extractPageMetadata} from "./extractPageMetadata";
import {applyExtractorRules, generateRules} from "./rules/applyRules";
import {extractPageContent} from "./extractPageContent";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import converter from "../../../shared/formatter/formatMarkdown";
import {EXTRACTOR_FALLBACK_ACTION} from "../../utils/fallbackActions";
import {formatFilename} from "../../../shared/formatter/formatText";

export async function extractPage(domain) {
  let json, module, metadata;
  switch (domain.name) {
    case "PhindSearch":
      module = require("./domains/PhindSearch");
      json = require("./domains/PhindSearch.json");
      break;
    case "PhindChat":
      module = require("./domains/PhindChat");
      json = require("./domains/PhindChat.json");
      break;
    case "Perplexity":
      module = require("./domains/Perplexity");
      json = require("./domains/Perplexity.json");
      break;
    case "PerplexityPages":
      module = require("./domains/PerplexityPages");
      json = require("./domains/PerplexityPages.json");
      break;
    case "MaxAIGoogle":
      module = require("./domains/MaxAIGoogle");
      json = require("./domains/MaxAIGoogle.json");
      break;
    default:
      module = require("./domains/ArbitraryPage");
      json = require("./domains/ArbitraryPage.json");
  }
  metadata = metadata ?? extractPageMetadata(json);
  const rules = (json?.turndown && generateRules(json?.turndown)) ?? module.turndown;

  applyExtractorRules(rules);

  return {
    title: metadata.pageTitle,
    fileName: formatFilename(metadata.pageTitle, metadata.domainName),
    markdownContent: await safeExecute(module.extractPageContent
      ? module.extractPageContent(converter[`formatMarkdown`], metadata)
      : extractPageContent(converter[`formatMarkdown`], metadata, module.processMessage)
      , EXTRACTOR_FALLBACK_ACTION()),
  };
}
