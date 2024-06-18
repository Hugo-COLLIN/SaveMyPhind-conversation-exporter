import {extractPageMetadata} from "./extractPageMetadata";
import {applyExtractorRules, generateRules} from "./rules/applyRules";
import {extractPageContent} from "./extractPageContent";
import {safeExecute} from "../../shared/utils/jsShorteners";
import converter from "../../shared/formatter/formatMarkdown";
import {EXTRACTOR_FALLBACK_ACTION} from "../utils/fallbackActions";
import {formatFilename} from "../../shared/formatter/formatText";

export async function extractPage(domain) {
  let json, module, metadata;
  // module = import(`./domains/${domain.name}`);
  module = await import(`../../../assets/extract-rules/${domain.name}.js`);
  console.log(module)
  // json = import(`./domains/${domain.name}.json`);
  json = await import(`../../../assets/extract-rules/${domain.name}.json`);
  console.log(json)
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
