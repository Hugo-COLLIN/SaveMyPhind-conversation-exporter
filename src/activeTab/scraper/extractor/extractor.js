import extractPages from "./extractPages";
import extractMetadata from "./extractMetadata";
import converter from "../../utils/format/formatMarkdown";
import {formatFilename} from "../../utils/format/formatText";
import {dynamicCall} from "../../../common/utils";
import {getAppInfos} from "../../../common/appInfos";

export async function extract(domain) {
  try {
    const markdownContent = await dynamicCall(extractPages, `extract${domain.name}Page`, converter[`formatMarkdown`]);
    const metadata = dynamicCall(extractMetadata, `extract${domain.name}Metadata`);
    const fileName = formatFilename(metadata.title, domain.name.replace(/([a-z])([A-Z])/g, '\$1-\$2')); //???
    return {markdownContent, title: metadata.title, fileName};
  }
  catch (e) {
    console.error(e);
    const appInfos = await getAppInfos();
    alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    return null;
  }
}