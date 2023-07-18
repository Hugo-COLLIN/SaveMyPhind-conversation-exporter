import {exportPhindPair, exportPhindSearch, exportRandomPage} from "./extract";
import {getPhindPageTitle} from "../utils/utils";

export async function catchContent() {
  const url = window.location.href;
  let markdownContent = "", title = "";
  switch (true) {
    case url.includes('www.phind.com/search'):
      markdownContent = await exportPhindSearch();
      title = getPhindPageTitle();
      // download(markdownContent, getPhindPageTitle());
      // await saveToClipboard(markdownContent);
      break;
    case url.includes('www.phind.com/agent'):
      markdownContent = await exportPhindPair();
      title = getPhindPageTitle();
      break;
    default: {
      markdownContent = await exportRandomPage();
      title = document.title;
    }
  }
  return {markdownContent, title};
}