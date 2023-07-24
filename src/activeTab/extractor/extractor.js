import {exportPhindPair, exportPhindSearch, exportRandomPage} from "./extractPages";

import {fetchInfos, getPhindPageTitle} from "./getters";

export async function catchContent() {
  try {
    const url = window.location.href;
    let markdownContent = "", title = "";
    switch (true) {
      case url.includes('www.phind.com/search'):
        markdownContent = await exportPhindSearch();
        title = getPhindPageTitle();
        break;
      case url.includes('www.phind.com/agent'):
        markdownContent = await exportPhindPair();
        title = getPhindPageTitle();
        break;
      default: {
        return null;
        // markdownContent = await exportRandomPage();
        // title = document.title;
      }
    }
    return {markdownContent, title};
  }
  catch (e) {
    console.log(e);
    const appInfos = await fetchInfos();
    alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with these information if the problem persists:\n≫ The steps to reproduce the problem\n≫ The URL of this page\n≫ The app version: ${appInfos.APP_VERSION}\n≫ Screenshots illustrating the problem\n\nThank you!`);
    return null;
  }
}