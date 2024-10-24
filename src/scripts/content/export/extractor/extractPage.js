import {extractPageMetadata} from "./extractPageMetadata";
import {applyExtractorRules, generateRules} from "./rules/applyRules";
import {extractPageContent} from "./extractPageContent";
import {safeExecute} from "../../../shared/utils/jsShorteners";
import converter from "../../../../services/format/formatMarkdown";
import {EXTRACTOR_FALLBACK_ACTION} from "../../utils/fallbackActions";
import {patternBasedFormatFilename} from "../../../../services/format/formatText";

export async function extractPage(domain) {
  let json, module, metadata;
  switch (domain.name) {
    case "PhindSearch":
      json = require("./domains/PhindSearch.json");
      break;
    case "PhindChat":
      json = require("./domains/PhindChat.json");
      break;
    case "Perplexity":
      json = require("./domains/Perplexity.json");
      break;
    case "PerplexityPages":
      json = require("./domains/PerplexityPages.json");
      break;
    case "MaxAIGoogle":
      module = require("./domains/MaxAIGoogle");
      json = require("./domains/MaxAIGoogle.json");
      break;
    case "ChatGPT":
    case "ChatGPTShare":
      module = require("./domains/ChatGPT");
      json = require("./domains/ChatGPT.json");
      break;
    default:
      module = require("./domains/ArbitraryPage");
      json = require("./domains/ArbitraryPage.json");
  }
  metadata = metadata ?? extractPageMetadata(json);
  const rules = (json?.turndown && generateRules(json?.turndown)) ?? module?.turndown;

  applyExtractorRules(rules);

  return {
    title: metadata.pageTitle,
    fileName: await patternBasedFormatFilename(metadata.pageTitle, metadata.domainName),
    markdownContent: await extractContent(module, metadata),
  };
}

async function extractContent(module, metadata) {
  return safeExecute(module?.extractPageContent
      ? module.extractPageContent(converter[`formatMarkdown`], metadata)
      : extractPageContent(converter[`formatMarkdown`], metadata, module?.processMessage)
    , EXTRACTOR_FALLBACK_ACTION());
}
