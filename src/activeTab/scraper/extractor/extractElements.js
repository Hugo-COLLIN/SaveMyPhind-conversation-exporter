import {sleep} from "../../../common/utils";
import {formatLink} from "../../formatter/formatMarkdown";

export async function extractPerplexitySources(content, format) {
  let res = "";
  for (const btn of content.querySelectorAll("div.flex > button")) {
    if (btn.querySelector("span") && btn.querySelector("span").innerText === "View Sources") {
      btn.click();
      await sleep(10);

      let i = 1;
      for (const result of document.querySelectorAll("main > .justify-center.items-center .py-md .py-md")) {
        const link = result.querySelector("a");
        const text = "(" + i + ") " + format(result.querySelector("div.default > div").innerText.replaceAll("\n", " ").replaceAll('"', ''));
        res += (link ? formatLink(link.href, text) : text) + "\n";
        i ++;
      }

      const btnQuit = document.querySelector("main > .justify-center.items-center button.bg-super");
      btnQuit.click();
      await sleep(1);

      return res;
    }

  }
  return null;
}

export async function extractPhindSourcesFromPopup(msgContent, searchResults, res, format) {
  const buttonsInCard = msgContent[2].querySelectorAll("button");
  for (const btn of buttonsInCard) {
    if (btn.textContent.toLowerCase() === "view all search results") {
      // Open modal
      btn.click();
      await sleep(0); // Needed to wait for the modal to open (even if it's 0!)

      // Export sources and all search results, put correct index in front of each link
      let i = 1;
      let allResults = "**All search results:**";

      const dialogLinks = Array.from(document.querySelectorAll("[role='dialog'] a"));
      const p2Array = Array.from(searchResults);
      dialogLinks.forEach((link) => {
        // If the link is in the sources, add it to the sources with the correct index
        if (p2Array.find((elt) => elt.getAttribute("href") === link.getAttribute("href"))) {
          res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
        }

        // Add the link to the all search results with the correct index
        allResults += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
        i++;
      });

      // Append all search results after the sources
      res += "\n\n" + allResults;

      // Close modal
      document.querySelectorAll("[role='dialog'] [type='button']").forEach((btn) => {
        if (btn.textContent.toLowerCase() === "close") btn.click();
      });
    }
  }
  return res;
}