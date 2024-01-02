import converter from "../../formatter/formatMarkdown";
import {formatFilename} from "../../formatter/formatText";
import appInfos from "../../../infos.json";

export async function extract(domain) {
  try {
    console.log(domain)
    let module;
    switch (domain.name) {
      case "PhindSearch":
        module = await import(`./ExtractorPhindSearch`);
        break;
      case "PhindAgent":
        module = await import(`./ExtractorPhindAgent`);
        break;
      case "Perplexity":
        module = await import(`./ExtractorPerplexity`);
        break;
      case "MaxAIGoogle":
        module = await import(`./ExtractorMaxAIGoogle`);
        break;
      default:
        module = await import(`./ExtractorArbitraryPage`);
    }
    // let extractor = await import(`./Extractor${domain.name}`);
    console.log(module);

    let extractor = new module.default(domain);
    console.log(extractor);


    const markdownContent = await extractor.extractPage(converter[`formatMarkdown`]) //await dynamicCall(extractPages, `extract${domain.name}Page`, converter[`formatMarkdown`]);
    console.log(markdownContent)
    const metadata = await extractor.extractMetadata() //await dynamicCall(extractMetadata, `extract${domain.name}Metadata`);
    console.log(metadata)
    const fileName = formatFilename(metadata.title, metadata.source);
    console.log(fileName)
    return {markdownContent, title: metadata.title, fileName};
  }
  catch (e) {
    console.error(e);
    alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    return null;
  }
}
