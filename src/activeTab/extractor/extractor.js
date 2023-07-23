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
    alert(`Error while exporting page.\n\nPlease contact me at ${appInfos.CONTACT_EMAIL} with this error message if the problem persists:\n\n${e}`);
    return null;
  }
}