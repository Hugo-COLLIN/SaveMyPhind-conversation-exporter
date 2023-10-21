import {sleep} from "../../../common/utils";
import {formatLink} from "../../utils/format/formatMarkdown";

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