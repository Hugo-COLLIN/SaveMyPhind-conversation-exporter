import {setFileHeader} from "../formatter/formatMarkdown.all";
import {sleep} from "../../utils/utils.all";
import ExtractorPhind from "./ExtractorPhind.tab";

export default class ExtractorPhindChat extends ExtractorPhind {
  getPageTitle() {
    const agentFirstMsg = document.querySelector('[tabindex="0"]');
    return agentFirstMsg
        ? agentFirstMsg.innerText.replace(/\u00A0/g, " ")
        : "";
  }

  async extractPage(format) {
    const messages = document.querySelectorAll('[name^="answer-"]');
    let markdown = await setFileHeader(this.getPageTitle(), "Phind Chat");

    for (const content of messages) {
      const allDivs = content.querySelectorAll('.col > div > div > div');
      const msgContent = Array.from(allDivs).filter(div => div.children.length > 0);
      const searchResults = content.querySelectorAll('.col > div > div > div:nth-last-of-type(1) > div > a');
      const entityName = content.querySelectorAll('.col > div > div > span');

      if (msgContent.length === 0) continue;

      let res = "";

      // Extract writer name
      if (entityName.length > 0) {
        res += "## ";
        let putSeparator = true;
        entityName.forEach((elt) => {
          res += format(elt.innerHTML);
          if (entityName.length > 1 && entityName[1].innerHTML !== "" && putSeparator) {
            res += " - ";
            putSeparator = false;
          }
        });
        res += "\n";
      }

      // Extract message
      if (searchResults.length > 0) // If there are search results
      {
        // Message
        res += format(msgContent[0].innerHTML) + "\n";

        // Export search results
        res += "___\n**Sources:**";

        if (msgContent[2]) {
          res = await this.extractSources(msgContent, searchResults, res, format);
        }
        else {
          let i = 1;
          searchResults.forEach((link) => {
            res += "\n- " + format(link.outerHTML).replace("[", `[(${i}) `);
            i ++;
          })
        }

        res += "\n";

      } else // If there are no search results
        msgContent.forEach((elt) => {
          res += format(elt.innerHTML) + "\n";
        });

      if (res !== "") markdown += res + "\n\n";
    }

    return markdown;
  }

  getPageSource() {
    return "Phind-Chat";
  }

  async extractSources(msgContent, searchResults, res, format) {
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
}
