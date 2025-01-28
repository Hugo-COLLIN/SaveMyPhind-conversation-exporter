import {safeExecute} from "../../utils/jsShorteners";
import converter from "../format/formatMarkdown";
import {extractPageContent} from "./extractPageContent";
import appInfos from "../../../data/infos.json";

export async function extractContent(module: {
  extractPageContent: (arg0: any, arg1: any) => Promise<void>;
  processMessage: any;
}, metadata: any) {
  return safeExecute(module?.extractPageContent
      ? module.extractPageContent(converter[`formatMarkdown`], metadata)
      : extractPageContent(converter[`formatMarkdown`], metadata, module?.processMessage)
    , EXTRACTOR_FALLBACK_ACTION());
}

export function EXTRACTOR_FALLBACK_ACTION() {
  return (error: { stack: string; }) => {
    // @ts-ignore TODO variables at compile time
    alert(`${appInfos.APP_SNAME}: Error while extracting page content.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    throw new Error("Error while extracting page content:\n" + error.stack);
  };
}
