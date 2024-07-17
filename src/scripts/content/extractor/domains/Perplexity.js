import {safeExecute, sleep} from "../../../shared/utils/jsShorteners";
import {formatLink} from "../../../shared/formatter/formatMarkdown";
import {selectAndClick} from "../../interact/interact";

/**
 * Extracts the content of a message from Perplexity
 * @param content {HTMLElement}
 * @param format {(text: string) => string}
 * @returns {Promise<string>}
 */
export async function processMessage(content, format) {
  if (!content.hasChildNodes()) return "";
  const question = content.querySelector('.break-words');
  if (!question) return "";
  let markdown = "## User\n";
  const questionText = (question && question.innerText ? question.innerText : "") + "\n\n";
  markdown += questionText.replace(/(?<!`)<(?!`)/g, '\\<').replace(/(?<!`)>(?!`)/g, '\\>');

  const answer = content.querySelector(".relative.default > div > div");
  const answerer = content.querySelector(".mb-lg .flex.items-center > p");
  markdown += answerer && answerer.innerHTML.toLowerCase().includes('pro')
    ? "## Pro answer\n"
    : "## AI answer\n";
  markdown += format(answer.innerHTML) + "\n\n";

  // Display analysis section
  // const analysis = content.querySelectorAll('.space-y-md.mt-md > div');
  // for (const analysisSection of analysis) {
  //   const sectionTitle = analysisSection.querySelectorAll('div.taco .default')[1];
  //   const sectionContent = analysisSection.querySelector('div.grow');
  //   if (sectionTitle && analysisSection.querySelector(".grid") === null) markdown += "**" + format(sectionTitle.innerText) + ":**\n";
  //   if (sectionContent !== null && sectionContent.querySelector(".grid") === null) markdown += format(sectionContent.innerHTML) + "\n\n";
  // }
  // if (analysis[0].querySelector(".grid") !== null) markdown += "**Quick search:**\n";

  // Display sources
  const src = await safeExecute(await extractSources(content, format));
  if (src !== null) markdown += src + "\n";

  return markdown;
}

const SOURCES_HEADER = "---\n**Sources:**\n";

export async function extractSources(content, format) {
  // Open sources modal
  const res = await interactAndCatch(content, [
    {
      open: [{selector: 'button > div > svg[data-icon="ellipsis"]', scope: 'content'}, {selector: '.cursor-point [data-icon="sources"]', scope: 'document'}],
      close: [{selector: '[data-testid="close-modal"]', scope: 'document'}],
      selector: 'TODO'
    },
    {
      open: [{selector: 'div.grid > div.flex:nth-last-of-type(1)', scope: 'content'}],
      close: [{selector: '[data-testid="close-modal"]', scope: 'document'}],
      selector: 'TODO'
    },
  ], SOURCES_HEADER, format);

  // async function interactAndCatch() {
  //   const btnBottomExpand = content.querySelector('button > div > svg[data-icon="ellipsis"]');
  //   let btnBottomSources;
  //   const btnExpandSources = content.querySelector("div.grid > div.flex:nth-last-of-type(1)"); // Get the last button, useful when uploaded file div
  //   if (btnBottomExpand) {
  //     btnBottomExpand.parentNode?.click();
  //     await sleep(10);
  //     btnBottomSources = document.querySelector('.cursor-pointer svg[data-icon="list-timeline"]');
  //     if (btnBottomSources) btnBottomSources.parentNode?.click();
  //   }
  //   if (!btnBottomSources) {
  //     btnExpandSources?.click();
  //   }
  //   // console.log(btnExpandSources)
  //
  //   // if there's a div tile and it contains multiple images (so it's not a file tile)
  //   if (btnBottomSources || (btnExpandSources && btnExpandSources.querySelectorAll("img").length > 0)) {
  //     await sleep(10);
  //
  //     // Extract sources list from modal
  //     await safeExecute(extractFromModal.call(this));
  //
  //     // Close sources modal
  //     const closeBtn = document.querySelector('[data-testid="close-modal"]');
  //     if (closeBtn) closeBtn.click();
  //     // if (btnBottomExpand) btnBottomExpand.parentNode?.click(); // causes bug
  //   } else
  //     await safeExecute(extractFromTileList.call(this));
  // }
  //
  // await interactAndCatch.call(this);

  // Don't export header if no sources
  return res !== SOURCES_HEADER
    ? res
    : "";
}

async function extractFromModal(res, format) {
  let i = 1;
  for (const tile of document.querySelectorAll(".fixed > div > [class] > div > div > div > div > div > .flex.group")) {
    res += await formatSources(i, format, tile);
    i++;
  }
  return res;
}

async function extractFromTileList(res, format, content) {
  let i = 1;
  // Case the first tile is a file, not a link
  const tilesNoLink = content.querySelectorAll("div.grid > div.flex");
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
 * Generic function using list of queryselectors (1 for open possibilities, 1 for close) ; they are executed one after the other
 * @param content {HTMLElement}
 * @param {Array<{open: Array<{selector: string, scope: string}>, close: Array<{selector: string, scope: string}>, selector: string}>} selectors // scope:document/parent/child/...
 * @param sources_header
 * @param format
 * @param afterActionSelector
 * @returns {Promise<void>}
 */
export async function interactAndCatch(content, selectors, sources_header, format, afterActionSelector = null) {
  let res;
  for (const {open, close, selector} of selectors) {
    const btnBottomExpand = await safeExecute(await selectAndClick(open, content));

    res = await safeExecute(
      btnBottomExpand
        ? await extractFromModal(sources_header, format)
        : await extractFromTileList(sources_header, format, content),
      res);

    await safeExecute(await selectAndClick(close, content));

    if (res && res !== sources_header)
      break;
  }

  const afterAction = document.querySelector(afterActionSelector);
  if (afterAction) {
    await sleep(100);
    afterAction.click();
  }

  return res;
}


export async function formatSources(i, format, tile) {
  const text = "(" + i + ") "
    + format(tile.querySelector("div.default").innerText
      .replaceAll("\n", " ")
      .replaceAll('"', '')
      .replaceAll(/^[0-9]+./g, "")
    );

  async function extractYoutubeLink(tile) {
    await sleep(10); //to be sure
    const clickElt = tile.querySelector('.group')

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
