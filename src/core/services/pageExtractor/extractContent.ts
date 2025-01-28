import {safeExecute} from "../../utils/jsShorteners";
import converter from "../format/formatMarkdown";
import {extractPageContent} from "./extractPageContent";
import {EXTRACTOR_FALLBACK_ACTION} from "../../../features/fallbackActions";

export async function extractContent(module: {
  extractPageContent: (arg0: any, arg1: any) => Promise<void>;
  processMessage: any;
}, metadata: any) {
  return safeExecute(module?.extractPageContent
      ? module.extractPageContent(converter[`formatMarkdown`], metadata)
      : extractPageContent(converter[`formatMarkdown`], metadata, module?.processMessage)
    , EXTRACTOR_FALLBACK_ACTION());
}
