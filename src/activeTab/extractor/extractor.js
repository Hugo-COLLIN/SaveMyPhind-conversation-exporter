import {exportPhindPair, exportPhindSearch, exportRandomPage} from "./extractPages";

import {getPhindPageTitle} from "./getters";

export async function catchContent() {
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