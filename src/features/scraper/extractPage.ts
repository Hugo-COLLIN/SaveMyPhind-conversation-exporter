import {extractPageMetadata} from "../../core/services/pageExtractor/extractPageMetadata";
import {applyExtractorRules, generateRules} from "../../core/services/pageExtractor/applyRules";
import {patternBasedFormatFilename} from "../../core/services/format/formatText";
import {extractContent} from "../../core/services/pageExtractor/extractContent";

export async function extractPage(domain: { name: any; url?: any; }) {
  let json, module, metadata;
  switch (domain.name) {
    case "PhindSearch":
      json = require("./domains/PhindSearch.json");
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
    case "ChatGPTBots":
    case "ChatGPTSignedOut":
      module = require("./domains/ChatGPT");
      json = require("./domains/ChatGPT.json");
      break;
    case "ClaudeChat":
      module = require("./domains/ClaudeChat");
      json = require("./domains/ClaudeChat.json");
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
    markdownContent: await extractContent(module, metadata) as unknown as string,
  };
}

