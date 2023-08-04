import {sleep} from "../../../common/utils";
import {formatLink} from "../../utils/format/formatMarkdown";

export async function extractPerplexitySources(content, format) {
  let res = "";
  for (const btn of content.querySelectorAll("div.flex > button")) {
    if (btn.querySelector("span").innerText === "View Sources") {
      btn.click();
      await sleep(1);

      for (const result of document.querySelectorAll("main > .justify-center.items-center .py-md .py-md")) {
        const link = result.querySelector("a");
        const text = link.querySelector(".default > div").innerText.replaceAll("\n", " ").replaceAll('"', '');
        res += formatLink(link.href, text) + "\n";
      }

      const btnQuit = document.querySelector("main > .justify-center.items-center button.bg-super");
      console.log(btnQuit)
      btnQuit.click();
      await sleep(1);

      return res;
    }

  }
  return true;
}


// const expandSources = analysisSection.querySelector(".grid > div > .default");
// if (expandSources !== null) await expandSources.click();

// const sourceGrid = analysisSection.querySelectorAll(".grid > a, .grid > div > a");
// console.log(sourceGrid)
// if (sourceGrid.length > 0)
// {
//   let i = 1;
//   sourceGrid.forEach((source) => {
//     const text = source.querySelector(".default").innerHTML;
//     // console.log(text)
//     console.log(`[(${i}) ${text}](${source.getAttribute("href")})`);
//     i++;
//   });
// }

// console.log(sectionContent[0].querySelector(".default").innerHTML);