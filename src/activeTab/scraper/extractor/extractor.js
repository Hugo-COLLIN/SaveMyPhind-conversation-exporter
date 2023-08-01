import extractPages from "./extractPages";
import extractMetadata from "./extractMetadata";
import {fetchInfos} from "../../webpage/getters";
import {formatFilename} from "../../formatUtils/formatText";
import {dynamicCall} from "../../utils/utils";

// export async function catchContent() {
//   try {
//     const url = getUrl();
//     let markdownContent = "", title = "", siteName = "";
//     switch (true) {
//       case url.includes('www.phind.com/search'):
//         markdownContent = await extractPhindSearch();
//         title = getPhindPageTitle();
//         siteName = "Phind-Search"
//         break;
//       case url.includes('www.phind.com/agent'):
//         markdownContent = await extractPhindAgent();
//         title = getPhindPageTitle();
//         siteName = "Phind-Agent";
//         break;
//       default: {
//         return null;
//         // markdownContent = await exportRandomPage();
//         // title = document.title;
//       }
//     }
//     const fileName = formatFilename(title, siteName); //???
//     return {markdownContent, title, siteName, fileName};
//   }
//   catch (e) {
//     console.log(e);
//     const appInfos = await fetchInfos();
//     alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
//     return null;
//   }
// }

export async function extract(domain) {
  try {
    const markdownContent = await dynamicCall(extractPages, `extract${domain.name}`);
    const metadata = dynamicCall(extractMetadata, `extract${domain.name}Metadata`);
    const fileName = formatFilename(metadata.title, domain.name.replace(/([a-z])([A-Z])/g, '\$1-\$2')); //???
    return {markdownContent, title: metadata.title, fileName};
  }
  catch (e) {
    console.error(e);
    const appInfos = await fetchInfos();
    alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    return null;
  }
}