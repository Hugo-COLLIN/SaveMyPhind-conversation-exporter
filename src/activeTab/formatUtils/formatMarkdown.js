import {formatMarkdown} from "../scraper/formatter/formatter";
import {fetchInfos, getUrl} from "../webpage/getters";
import {capitalizeFirst, formatDate, titleShortener} from "./formatText";

/**
 * Format a url as a markdown link
 * @param url url to format
 * @param message text to display for the link
 * @returns {string} formatted link
 */
export function formatUrl(url, message) {
  return "[" + message + "](" + url.replace(/\)/g, "%29") + ")";
}

/**
 * Returns the header to put at the beginning of the markdown file
 * @returns {string} header
 */
export async function setFileHeader(title, linkSite) {
  try {
    const titles = formatMarkdown(capitalizeFirst(titleShortener(title)[0]));
    const json = await fetchInfos();
    return "# " + titles + "\n" + "Exported on " + formatDate(1, new Date()) + " " + formatUrl(getUrl(), `from ${linkSite}`) + ` - with ` + formatUrl(`${json.APP_REPO_URL ?? ""}`, `${json.APP_SNAME ?? ""}`) + "\n\n";
  } catch (e) {
    console.error(e)
  }
}