import {safeExecute, sleep} from "../../utils/jsShorteners";
import {resetPagination, selectAndClick} from "../interact/cs/interact";
import {formatLink} from "../format/formatMarkdown";
import {waitAppears} from "../../utils/cs/interactDOM";

const SOURCES_HEADER = "\n\n---\n**Sources:**\n";
let res = "";
let i = 1;

/**
 * Generic function using list of queryselectors (1 for open possibilities, 1 for close) ; they are executed one after the other
 * @param content {HTMLElement} The part of the page to extract sources from
 * @param format {function} The function to format the sources
 * @param {Object<selectors: Array<{open: Array<{selector: string, scope: string}>, close: Array<{selector: string, scope: string}>, selector: string}>, afterAction: string>} data // scope:document/parent/child/...
 */
export async function extractSources(content: HTMLElement, format: any, data: { selectors: any; afterAction: any; }) {
  // Reset to avoid keeping the previous results
  res = "";
  i = 1;

  for (const {open, close, selector, extractionType, paginationSelector, content: msgContent, scope: scopeType } of data.selectors) {
    open && await safeExecute(await selectAndClick(open, content));

    switch (extractionType) {
      case 'list':
        res = await safeExecute(await extractFromList(format, content, selector ?? msgContent, scopeType)) as unknown as string;
        break;
      case 'tile-list':
        res = await safeExecute(await extractFromTileList(format, content, selector)) as unknown as string;
        break;
      case 'links':
        res = await safeExecute(selectAndExtract(selector, content, format)) as unknown as string;
        break;
      case 'paginated-links':
        res = await safeExecute(await extractFromPaginatedLinks(selector, content, format, paginationSelector)) as unknown as string;
        break;
      default:
        console.warn("No extraction type specified");
    }

    close && await safeExecute(await selectAndClick(close, content));

    if (res) break;
  }

  const afterAction = document.querySelector(data.afterAction);
  if (afterAction) {
    await sleep(100);
    afterAction.click();
  }

  return res && SOURCES_HEADER + res;
}

/**
 * Extract sources from paginated links
 * @param selector {string}
 * @param content {HTMLElement}
 * @param format {function}
 * @param paginationSelector {string}
 * @returns {Promise<string>}
 */
async function extractFromPaginatedLinks(selector: any, content: HTMLElement, format: any, paginationSelector: any): Promise<string> {
  const pagination = content.querySelectorAll(paginationSelector);

  if (pagination && pagination.length > 0) {
    for (const elt of pagination) {
      elt.click();
      await sleep(0); // Wait for the content to load (even if it is 0!)
      res += selectAndExtract(selector, content, format);
    }
    resetPagination(pagination);
  }

  return res;
}

/**
 * Extract sources from a selector
 * @param selector {string}
 * @param content {HTMLElement}
 * @param format {function}
 * @returns {string} The formatted sources
 */
function selectAndExtract(selector: any, content: HTMLElement, format: any): string {
  const selectSources = content.querySelectorAll(selector);
  return extractFromLinks(selectSources, format);
}

function extractFromLinks(links: any[] | NodeListOf<any>, format: (arg0: any) => string) {
  let res = "";
  links.forEach((link) => {
    res += "- " + format(link.outerHTML).replace("[", `[(${i}) `) + "\n";
    i++;
  });
  return res;
}

/**
 * Extract sources from a list of tiles
 * @param format {function}
 * @param content
 * @param selectorOrContent
 * @returns {Promise<string>}
 */
async function extractFromList(format: any, content: HTMLElement, selectorOrContent: { selector: any; scope: any; }, scopeType: string): Promise<string> {
  let res = '';
  let i = 1;

  const selector = typeof selectorOrContent === "object"
    ? selectorOrContent.selector
    : selectorOrContent;

  const scope = scopeType === "content"
    ? "content"
    : typeof selectorOrContent === "object"
      ? selectorOrContent.scope
      : "document";

  const qs = scope === "document"
    ? document.querySelectorAll(selector)
    : content.querySelectorAll(selector);

  // console.log(content, scope, qs)
  for (const tile of qs) {
    res += await formatSources(i, format, tile);
    i++;
  }
  return res;
}

/**
 * Extract sources from a tile list
 * @param format {function}
 * @param content {HTMLElement}
 * @param selector {string}
 * @returns {Promise<string>}
 */
async function extractFromTileList(format: any, content: HTMLElement, selector: any): Promise<string> {
  let res = '';
  let i = 1;
  // Case the first tile is a file, not a link
  const tilesNoLink = content.querySelectorAll(selector);
  for (const tile of tilesNoLink) {
    if (tile.querySelectorAll("img").length === 0) {
      res += await formatSources(i, format, tile);
      i++;
    }
  }

  // Link tiles
  for (const tile of content.querySelectorAll("div.grid > a")) {
    res += await formatSources(i, format, tile);
    i++;
  }
  return res;
}

/**
 * Format sources
 * @param i {number}
 * @param format {function}
 * @param tile {HTMLElement}
 * @returns {Promise<string>}
 */
export async function formatSources(i: string | number, format: (arg0: any) => string, tile: Element): Promise<string> {
  const elt: HTMLElement = tile.querySelector("div.default") as HTMLElement //Perplexity
    || tile;

  const text = "(" + i + ") "
    + format(elt.innerText
      .replaceAll("\n", " ")
      .replaceAll('"', '')
      .replace(/^\d+/, "") // Removes numbers at the beginning
      .replaceAll('[', '')
      .replaceAll(']', '')
      .trim()
    );

  async function extractYoutubeLink(tile: HTMLElement) {
    await sleep(10); //to be sure
    const clickElt = tile
    // .querySelector('.group')

    if (!clickElt) {
      console.warn("clickElt undefined");
      return null;
    }

    clickElt.click();
    await sleep(500); // needed for youtube player to load

    // Get the youtube embed
    const link = await waitAppears('.fixed iframe', 100, 10) as HTMLElement;

    if (!link) {
      console.warn("link undefined");
      return null;
    }

    // Select background to click (no close button)
    const el: HTMLElement = link.closest(".fixed") as HTMLElement;
    if (el) el.click();

    // @ts-ignore
    return link.src
  }

  // Export content
  let res = "- ";
  // @ts-ignore TODO
  if (tile && tile.href)
    // @ts-ignore TODO
    res += formatLink(tile.href, text) + "\n";
  else {
    const url: HTMLElement = await safeExecute(extractYoutubeLink(tile as HTMLElement)) as unknown as HTMLElement;
    res += url
      ? formatLink(url, text) + "\n"
      : text + "\n";
  }
  return res;
}


// async function extractSourcesOld(msgContent, searchResults, res, format) {
//   const buttonsInCard = msgContent[2].querySelectorAll("button");
//   for (const btn of buttonsInCard) {
//     if (btn.textContent.toLowerCase() === "view all search results") {
//       // Open modal
//       btn.click();
//       await sleep(0); // Needed to wait for the modal to open (even if it's 0!)
//
//       // Export sources and all search results, put correct index in front of each link
//       let i = 1;
//       let allResults = "**All search results:**";
//
//       const dialogLinks = Array.from(document.querySelectorAll("[role='dialog'] a"));
//       const p2Array = Array.from(searchResults);
//       dialogLinks.forEach((link) => {
//         // If the link is in the sources, add it to the sources with the correct index
//         if (p2Array.find((elt) => elt.getAttribute("href") === link.getAttribute("href"))) {
//           res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
//         }
//
//         // Add the link to the all search results with the correct index
//         allResults += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
//         i++;
//       });
//
//       // Append all search results after the sources
//       res += "\n\n" + allResults;
//
//       // Close modal
//       document.querySelectorAll("[role='dialog'] [type='button']").forEach((btn) => {
//         if (btn.textContent.toLowerCase() === "close") btn.click();
//       });
//     }
//   }
//   return res;
// }
