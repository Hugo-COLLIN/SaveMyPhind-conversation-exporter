import {safeExecute, sleep} from "../../../shared/utils/jsShorteners";
import {resetPagination, selectAndClick} from "../../interact/interact";
import {formatLink} from "../../../shared/formatter/formatMarkdown";

const SOURCES_HEADER = "---\n**Sources:**\n";
let res = "";
let i = 1;

/**
 * Generic function using list of queryselectors (1 for open possibilities, 1 for close) ; they are executed one after the other
 * @param content {HTMLElement} The part of the page to extract sources from
 * @param format {function} The function to format the sources
 * @param {Object<selectors: Array<{open: Array<{selector: string, scope: string}>, close: Array<{selector: string, scope: string}>, selector: string}>, afterAction: string>} data // scope:document/parent/child/...
 */
export async function extractSources(content, format, data) {
  // Reset to avoid keeping the previous results
  res = "";
  i = 1;

  for (const {open, close, selector, extractionType, paginationSelector} of data.selectors) {
    open && await safeExecute(await selectAndClick(open, content));

    switch (extractionType) {
      case 'list':
        res = await safeExecute(await extractFromList(format, selector));
        break;
      case 'tile-list':
        res = await safeExecute(await extractFromTileList(format, content, selector));
        break;
      case 'links':
        res = await safeExecute(selectAndExtract(selector, content, format));
        break;
      case 'paginated-links':
        res = await safeExecute(await extractFromPaginatedLinks(selector, content, format, paginationSelector));
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
async function extractFromPaginatedLinks(selector, content, format, paginationSelector) {
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
function selectAndExtract(selector, content, format) {
  const selectSources = content.querySelectorAll(selector);
  return extractFromLinks(selectSources, format);
}

function extractFromLinks(links, format) {
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
 * @param selector {string}
 * @returns {Promise<string>}
 */
async function extractFromList(format, selector) {
  let res = '';
  let i = 1;
  for (const tile of document.querySelectorAll(selector)) {
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
async function extractFromTileList(format, content, selector) {
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
export async function formatSources(i, format, tile) {
  const text = "(" + i + ") "
    + format(tile.querySelector("div.default").innerText
      .replaceAll("\n", " ")
      .replaceAll('"', '')
      .replaceAll(/^[0-9]+./g, "")
      .replaceAll('[', '')
      .replaceAll(']', '')
    );

  async function extractYoutubeLink(tile) {
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
    const link = document.querySelector('.fixed iframe');

    if (!link) {
      console.warn("link undefined");
      return null;
    }

    // Select background to click (no close button)
    const el = link.closest(".fixed");
    if (el) el.click();

    return link.src
  }

  // Export content
  let res = "- ";
  if (tile && tile.href)
    res += formatLink(tile.href, text) + "\n";
  else {
    const url = await safeExecute(extractYoutubeLink(tile));
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
