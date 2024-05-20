import ExtractorSources from "./ExtractorSources";
import {safeExecute, sleep} from "../../../shared/utils/jsShorteners";
import {formatLink} from "../../../shared/formatter/formatMarkdown";

export default class ExtractorSourcesPerplexity extends ExtractorSources {
  async extractSources(content, format) {
    const SOURCES_HEADER = "---\n**Sources:**\n";
    let res = SOURCES_HEADER;

    async function extractFromModal() {
      let i = 1;
      for (const tile of document.querySelectorAll(".fixed > div > [class] > div > div > div > div > div > .flex.group")) {
        res += await this.formatSources(i, format, tile);
        i++;
      }
    }

    async function extractFromTileList() {
      let i = 1;
      // Case the first tile is a file, not a link
      const tilesNoLink = content.querySelectorAll("div.grid > div.flex");
      for (const tile of tilesNoLink) {
        if (tile.querySelectorAll("img").length === 0) {
          res += await this.formatSources(i, format, tile);
          i++;
        }
      }

      // Link tiles
      for (const tile of content.querySelectorAll("div.grid > a")) {
        res += await this.formatSources(i, format, tile);
        i++;
      }
    }

    // Open sources modal
    const btnExpandSources = content.querySelector("div.grid > div.flex:nth-last-of-type(1)"); // Get the last button, useful when uploaded file div

    // if there's a div tile and it contains multiple images (so it's not a file tile)
    if (btnExpandSources && btnExpandSources.querySelectorAll("img").length > 0) {
      btnExpandSources.click();
      await sleep(10);

      // Extract sources list from modal
      await safeExecute(extractFromModal.call(this));

      // Close sources modal
      const closeBtn = document.querySelector('[data-testid="close-modal"]');
      if (closeBtn) closeBtn.click();
    }
    else
      await safeExecute(extractFromTileList.call(this));

    // Don't export header if no sources
    return res !== SOURCES_HEADER
      ? res
      : "";
  }

  async formatSources(i, format, tile) {
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
}
